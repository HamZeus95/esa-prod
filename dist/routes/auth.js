"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validate_1.validateRequest
], auth_1.login);
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', auth_1.refreshToken);
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', auth_2.authenticateToken, auth_1.logout);
// @route   POST /api/auth/logout-all
// @access  Private
router.post('/logout-all', auth_2.authenticateToken, auth_1.logoutAll);
// @route   GET /api/auth/me
// @access  Private
router.get('/me', auth_2.authenticateToken, auth_1.getProfile);
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', [
    auth_2.authenticateToken,
    (0, express_validator_1.body)('currentPassword')
        .isLength({ min: 1 })
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    validate_1.validateRequest
], auth_1.changePassword);
// TEMPORARY: @route   POST /api/auth/reset-password-flag
// @access  Private
router.post('/reset-password-flag', auth_2.authenticateToken, auth_1.resetMustChangePassword);
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    validate_1.validateRequest
], auth_1.forgotPassword);
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token', [
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('confirmPassword')
        .isLength({ min: 6 })
        .withMessage('Confirm password must be at least 6 characters long'),
    validate_1.validateRequest
], auth_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map