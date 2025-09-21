import express from 'express';
import { body } from 'express-validator';
import { login, refreshToken, logout, logoutAll, getProfile, changePassword, resetMustChangePassword, forgotPassword, resetPassword } from '../controllers/auth.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
const router = express.Router();
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validateRequest
], login);
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', refreshToken);
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticateToken, logout);
// @route   POST /api/auth/logout-all
// @access  Private
router.post('/logout-all', authenticateToken, logoutAll);
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticateToken, getProfile);
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', [
    authenticateToken,
    body('currentPassword')
        .isLength({ min: 1 })
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    validateRequest
], changePassword);
// TEMPORARY: @route   POST /api/auth/reset-password-flag
// @access  Private
router.post('/reset-password-flag', authenticateToken, resetMustChangePassword);
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    validateRequest
], forgotPassword);
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token', [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
        .isLength({ min: 6 })
        .withMessage('Confirm password must be at least 6 characters long'),
    validateRequest
], resetPassword);
export default router;
//# sourceMappingURL=auth.js.map