import express from 'express';
import { body, query } from 'express-validator';
import { submitContact, getContacts, getContact, updateContactStatus, updateContactPriority, addContactNote, deleteContact, getContactStats } from '../controllers/contacts.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
const router = express.Router();
// @route   GET /api/contacts/stats
// @access  Private (Admin)
router.get('/stats', authenticateToken, requireAdmin, getContactStats);
// @route   POST /api/contacts
// @access  Public
router.post('/', [
    body('name')
        .notEmpty()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name is required and must be between 2-100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('projectType')
        .notEmpty()
        .trim()
        .withMessage('Project type is required'),
    body('message')
        .notEmpty()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message is required and must be between 10-2000 characters'),
    validateRequest
], submitContact);
// @route   GET /api/contacts
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['all', 'unread', 'read', 'replied', 'archived']).withMessage('Invalid status filter'),
    query('priority').optional().isIn(['all', 'low', 'medium', 'high']).withMessage('Invalid priority filter'),
    validateRequest
], getContacts);
// @route   GET /api/contacts/:id
// @access  Private (Admin)
router.get('/:id', authenticateToken, requireAdmin, getContact);
// @route   PATCH /api/contacts/:id/status
// @access  Private (Admin)
router.patch('/:id/status', authenticateToken, requireAdmin, [
    body('status')
        .isIn(['unread', 'read', 'replied', 'archived'])
        .withMessage('Invalid status'),
    validateRequest
], updateContactStatus);
// @route   PATCH /api/contacts/:id/priority
// @access  Private (Admin)
router.patch('/:id/priority', authenticateToken, requireAdmin, [
    body('priority')
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority'),
    validateRequest
], updateContactPriority);
// @route   POST /api/contacts/:id/notes
// @access  Private (Admin)
router.post('/:id/notes', authenticateToken, requireAdmin, [
    body('note')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Note is required and must be between 1-1000 characters'),
    validateRequest
], addContactNote);
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteContact);
export default router;
//# sourceMappingURL=contacts.js.map