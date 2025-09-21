import express from 'express';
import { body } from 'express-validator';
import { getClients, getClient, createClient, updateClient, deleteClient } from '../controllers/clients.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
const router = express.Router();
// @route   GET /api/clients
// @access  Public
router.get('/', getClients);
// @route   GET /api/clients/:id
// @access  Public
router.get('/:id', getClient);
// @route   POST /api/clients
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, [
    body('name')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name is required and must be between 1-100 characters'),
    body('image')
        .optional()
        .isString()
        .trim()
        .withMessage('Image URL must be a string'),
    body('type')
        .optional()
        .isIn(['client', 'partner'])
        .withMessage('Type must be either client or partner'),
    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    validateRequest
], createClient);
// @route   PUT /api/clients/:id
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1-100 characters'),
    body('image')
        .optional()
        .isString()
        .trim()
        .withMessage('Image must be a string'),
    body('type')
        .optional()
        .isIn(['client', 'partner'])
        .withMessage('Type must be either client or partner'),
    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    validateRequest
], updateClient);
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteClient);
export default router;
//# sourceMappingURL=clients.js.map