"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const dashboard_1 = require("../controllers/dashboard");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
router.get('/stats', auth_1.authenticateToken, auth_1.requireAdmin, dashboard_1.getDashboardStats);
// @route   GET /api/dashboard/activity
// @access  Private (Admin)
router.get('/activity', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    (0, express_validator_1.query)('days').optional().isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30'),
    validate_1.validateRequest
], dashboard_1.getRecentActivity);
// @route   GET /api/dashboard/health
// @access  Private (Admin)
router.get('/health', auth_1.authenticateToken, auth_1.requireAdmin, dashboard_1.getSystemHealth);
exports.default = router;
//# sourceMappingURL=dashboard.js.map