import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }
        // Find user by email and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Check if user is active
        if (user.status !== 'active') {
            res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Generate tokens
        const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        const accessToken = jwt.sign(tokenPayload, accessTokenSecret, {
            expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
        });
        const refreshToken = jwt.sign(tokenPayload, refreshTokenSecret, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
        });
        // Update refresh tokens and last login
        user.refreshTokens.push(refreshToken);
        user.lastLogin = new Date();
        await user.save();
        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });
        // Remove sensitive data from response
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin,
            mustChangePassword: user.mustChangePassword,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.status(200).json({
            success: true,
            data: {
                user: userResponse,
                accessToken // Only access token in response, refresh token in httpOnly cookie
            },
            message: 'Login successful'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
    try {
        // Get refresh token from httpOnly cookie or request body (fallback)
        const refreshTokenValue = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!refreshTokenValue) {
            res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
            return;
        }
        // Verify refresh token
        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
        let decoded;
        try {
            decoded = jwt.verify(refreshTokenValue, refreshTokenSecret);
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
            return;
        }
        // Find user and check if refresh token exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
            return;
        }
        // Initialize refreshTokens array if it doesn't exist
        if (!user.refreshTokens) {
            user.refreshTokens = [];
            await user.save();
        }
        if (!user.refreshTokens.includes(refreshTokenValue)) {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
            return;
        }
        // Check if user is still active
        if (user.status !== 'active') {
            res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }
        // Generate new access token
        const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        const accessToken = jwt.sign(tokenPayload, accessTokenSecret, {
            expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
        });
        res.status(200).json({
            success: true,
            data: { accessToken },
            message: 'Token refreshed successfully'
        });
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Refresh token expired'
            });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
            return;
        }
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // Get refresh token from httpOnly cookie or request body (fallback)
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        const user = req.user;
        if (refreshToken && user) {
            // Remove specific refresh token
            await User.findByIdAndUpdate(user._id, {
                $pull: { refreshTokens: refreshToken }
            });
        }
        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
export const logoutAll = async (req, res) => {
    try {
        const user = req.user;
        if (user) {
            // Clear all refresh tokens
            await User.findByIdAndUpdate(user._id, {
                refreshTokens: []
            });
        }
        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        res.status(200).json({
            success: true,
            message: 'Logged out from all devices'
        });
    }
    catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;
        // Validate input
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
            return;
        }
        // Validate new password strength
        if (newPassword.length < 6) {
            res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
            return;
        }
        // Find user with password field
        const user = await User.findById(userId).select('+password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }
        // Check if new password is the same as current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            });
            return;
        }
        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        // Update password and mark that password has been changed
        await User.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
            mustChangePassword: false,
            updatedAt: new Date()
        });
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// TEMPORARY: Helper function to reset mustChangePassword for testing
export const resetMustChangePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        await User.findByIdAndUpdate(userId, {
            mustChangePassword: false
        });
        res.status(200).json({
            success: true,
            message: 'mustChangePassword flag reset'
        });
    }
    catch (error) {
        console.error('Reset mustChangePassword error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// Email transporter configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};
// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists or not for security
            res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
            return;
        }
        // Check if user is active
        if (user.status !== 'active') {
            res.status(400).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        // Set reset token and expiration (10 minutes)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password/${resetToken}`;
        // Send email
        try {
            const transporter = createTransporter();
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: user.email,
                subject: 'Password Reset Request - ESA Admin',
                html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #2C3E50; text-align: center;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password for your ESA Admin account.</p>
            <p>Click the button below to reset your password. This link will expire in 10 minutes.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
            };
            await transporter.sendMail(mailOptions);
        }
        catch (emailError) {
            console.error('Password reset email error:', emailError);
            // Clear the reset token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                message: 'Error sending password reset email. Please try again.'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Password reset link has been sent to your email.'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Password and confirm password are required'
            });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
            return;
        }
        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
            return;
        }
        // Update password and clear reset fields (don't hash here, let the pre-save hook do it)
        user.password = password; // Set plain password, let pre-save hook hash it
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.mustChangePassword = false; // Clear this flag if it was set
        // Clear all refresh tokens to force re-login
        user.refreshTokens = [];
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully. Please log in with your new password.'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
//# sourceMappingURL=auth.js.map