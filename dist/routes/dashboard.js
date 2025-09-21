import express from 'express';
import { query } from 'express-validator';
import { getDashboardStats, getRecentActivity, getSystemHealth } from '../controllers/dashboard.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
const router = express.Router();
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
router.get('/stats', authenticateToken, requireAdmin, getDashboardStats);
// @route   GET /api/dashboard/activity
// @access  Private (Admin)
router.get('/activity', authenticateToken, requireAdmin, [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('days').optional().isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30'),
    validateRequest
], getRecentActivity);
// @route   GET /api/dashboard/health
// @access  Private (Admin)
router.get('/health', authenticateToken, requireAdmin, getSystemHealth);
export default router;
//# sourceMappingURL=dashboard.js.map