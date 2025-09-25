"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePasswordChange = exports.optionalAuth = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authenticateToken = async (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        const user = await User_1.User.findById(decoded.userId).select('-password');
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
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Access token expired'
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
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
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            // No token provided, continue without user
            next();
            return;
        }
        const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
        const decoded = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        const user = await User_1.User.findById(decoded.userId).select('-password');
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
exports.optionalAuth = optionalAuth;
// Middleware to check if user must change password
const requirePasswordChange = async (req, res, next) => {
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
exports.requirePasswordChange = requirePasswordChange;
//# sourceMappingURL=auth.js.map