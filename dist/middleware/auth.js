import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
        const decoded = jwt.verify(token, accessTokenSecret);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
            return;
        }
        if (user.status !== 'active') {
            res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Access token expired'
            });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid access token'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
        return;
    }
    next();
};
// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            // No token provided, continue without user
            next();
            return;
        }
        const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
        const decoded = jwt.verify(token, accessTokenSecret);
        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.status === 'active') {
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Token invalid, continue without user
        next();
    }
};
// Middleware to check if user must change password
export const requirePasswordChange = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        // Skip password change check for auth routes and essential user management routes
        const exemptRoutes = [
            '/api/auth/change-password',
            '/api/auth/logout',
            '/api/auth/logout-all',
            '/api/auth/me',
            '/api/auth/reset-password-flag'
        ];
        // Also exempt if this is a GET request to users endpoint for admins or any users management operations
        const isUsersRequest = req.path.startsWith('/api/users');
        const isAdminUser = user.role === 'admin';
        if (exemptRoutes.includes(req.path) || (isUsersRequest && isAdminUser)) {
            next();
            return;
        }
        // Check if user must change password
        if (user.mustChangePassword) {
            res.status(403).json({
                success: false,
                message: 'Password change required',
                data: { mustChangePassword: true }
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Password change check error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
//# sourceMappingURL=auth.js.map