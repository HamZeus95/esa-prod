"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPassword = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = require("../models/User");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Get all users (admin only)
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await User_1.User.find()
            .select('-refreshTokens')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const totalUsers = await User_1.User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);
        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalUsers,
                itemsPerPage: limit
            }
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};
exports.getUsers = getUsers;
// Get user by ID (admin only)
const getUserById = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id).select('-refreshTokens');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};
exports.getUserById = getUserById;
// Create new user (admin only)
const createUser = async (req, res) => {
    try {
        const { email, name, role } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }
        // Generate temporary password
        const temporaryPassword = crypto_1.default.randomBytes(8).toString('hex');
        // Create user with temporary password (will be hashed by pre-save middleware)
        const user = new User_1.User({
            email,
            name,
            role: role || 'user',
            password: temporaryPassword,
            status: 'active',
            refreshTokens: [], // Initialize empty array
            mustChangePassword: true // Force password change on first login
        });
        await user.save();
        // Send email with temporary password
        await sendTemporaryPasswordEmail(email, name, temporaryPassword);
        // Return user without password and refresh tokens
        const userResponse = await User_1.User.findById(user._id).select('-refreshTokens -password');
        res.status(201).json({
            success: true,
            data: userResponse,
            message: 'User created successfully. Temporary password sent to email.'
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user'
        });
    }
};
exports.createUser = createUser;
// Update user (admin only)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, role, status } = req.body;
        // Don't allow admin to demote themselves
        if (req.user?.id === id && role === 'user') {
            res.status(400).json({
                success: false,
                message: 'Cannot change your own role from admin to user'
            });
            return;
        }
        // Don't allow admin to deactivate themselves
        if (req.user?.id === id && status === 'inactive') {
            res.status(400).json({
                success: false,
                message: 'Cannot deactivate your own account'
            });
            return;
        }
        const user = await User_1.User.findByIdAndUpdate(id, { email, name, role, status }, { new: true, runValidators: true }).select('-refreshTokens');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};
exports.updateUser = updateUser;
// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Don't allow admin to delete themselves
        if (req.user?.id === id) {
            res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
            return;
        }
        const user = await User_1.User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};
exports.deleteUser = deleteUser;
// Reset user password (admin only)
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Generate new temporary password
        const temporaryPassword = crypto_1.default.randomBytes(8).toString('hex');
        user.password = temporaryPassword;
        await user.save();
        // Send email with new temporary password
        await sendTemporaryPasswordEmail(user.email, user.name, temporaryPassword);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully. New temporary password sent to email.'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
};
exports.resetUserPassword = resetUserPassword;
// Helper function to send temporary password email
const sendTemporaryPasswordEmail = async (email, name, password) => {
    try {
        // Check if email configuration is available
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email configuration not found. Skipping email notification.');
            console.log(`User created: ${email}, Temporary password: ${password}`);
            return;
        }
        // Configure nodemailer using environment variables
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Add these options to handle auth issues
            tls: {
                rejectUnauthorized: false
            }
        });
        // Verify transporter configuration
        await transporter.verify();
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@esa-structures.tn',
            to: email,
            subject: 'ESA Structures - Temporary Password',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ESA Structures Admin Panel</h2>
          <p>Hello ${name},</p>
          <p>Your account has been created successfully. Here are your login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
          </div>
          <p><strong>Important:</strong> You must change this password on your first login for security reasons.</p>
          <p>You can access the admin panel at: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin">Admin Login</a></p>
          <p>If you have any questions, please contact the administrator.</p>
          <p>Best regards,<br>ESA Structures Team</p>
        </div>
      `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Temporary password email sent to ${email}`);
    }
    catch (error) {
        console.error('Email sending error:', error);
        console.log(`User created: ${email}, Temporary password: ${password}`);
        // Don't throw error here to avoid breaking user creation
    }
};
//# sourceMappingURL=users.js.map