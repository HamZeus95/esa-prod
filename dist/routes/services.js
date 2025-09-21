import express from 'express';
import { body, query } from 'express-validator';
import { getServices, getService, createService, updateService, deleteService, toggleServiceStatus, reorderServices } from '../controllers/services.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
const router = express.Router();
// @route   PUT /api/services/reorder
// @access  Private (Admin)
router.put('/reorder', authenticateToken, requireAdmin, [
    body('serviceIds')
        .isArray()
        .withMessage('Service IDs must be an array'),
    validateRequest
], reorderServices);
// @route   GET /api/services
// @access  Public
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isString().withMessage('Invalid category'),
    query('active').optional().isBoolean().withMessage('Active must be a boolean'),
    query('search').optional().isString().withMessage('Invalid search query'),
    validateRequest
], getServices);
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', getService);
// @route   POST /api/services
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, [
    body('title')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title is required and must be between 1-200 characters'),
    body('description')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description is required and must be between 1-500 characters'),
    body('detailedDescription')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Detailed description is required and must be between 1-2000 characters'),
    body('category')
        .notEmpty()
        .trim()
        .withMessage('Category is required'),
    body('features')
        .isArray()
        .withMessage('Features must be an array'),
    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),
    validateRequest
], createService);
// @route   PUT /api/services/:id
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1-200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1-500 characters'),
    body('detailedDescription')
        .optional()
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Detailed description must be between 1-2000 characters'),
    body('category')
        .optional()
        .isString()
        .withMessage('Category is required'),
    body('features')
        .optional()
        .isArray()
        .withMessage('Features must be an array'),
    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),
    validateRequest
], updateService);
// @route   PATCH /api/services/:id/toggle
// @access  Private (Admin)
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleServiceStatus);
// @route   DELETE /api/services/:id
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteService);
export default router;
//# sourceMappingURL=services.js.map