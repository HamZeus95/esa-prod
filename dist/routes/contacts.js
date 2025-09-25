"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const contacts_1 = require("../controllers/contacts");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// @route   GET /api/contacts/stats
// @access  Private (Admin)
router.get('/stats', auth_1.authenticateToken, auth_1.requireAdmin, contacts_1.getContactStats);
// @route   POST /api/contacts
// @access  Public
router.post('/', [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name is required and must be between 2-100 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('projectType')
        .notEmpty()
        .trim()
        .withMessage('Project type is required'),
    (0, express_validator_1.body)('message')
        .notEmpty()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message is required and must be between 10-2000 characters'),
    validate_1.validateRequest
], contacts_1.submitContact);
// @route   GET /api/contacts
// @access  Private (Admin)
router.get('/', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('status').optional().isIn(['all', 'unread', 'read', 'replied', 'archived']).withMessage('Invalid status filter'),
    (0, express_validator_1.query)('priority').optional().isIn(['all', 'low', 'medium', 'high']).withMessage('Invalid priority filter'),
    validate_1.validateRequest
], contacts_1.getContacts);
// @route   GET /api/contacts/:id
// @access  Private (Admin)
router.get('/:id', auth_1.authenticateToken, auth_1.requireAdmin, contacts_1.getContact);
// @route   PATCH /api/contacts/:id/status
// @access  Private (Admin)
router.patch('/:id/status', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('status')
        .isIn(['unread', 'read', 'replied', 'archived'])
        .withMessage('Invalid status'),
    validate_1.validateRequest
], contacts_1.updateContactStatus);
// @route   PATCH /api/contacts/:id/priority
// @access  Private (Admin)
router.patch('/:id/priority', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('priority')
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority'),
    validate_1.validateRequest
], contacts_1.updateContactPriority);
// @route   POST /api/contacts/:id/notes
// @access  Private (Admin)
router.post('/:id/notes', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('note')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Note is required and must be between 1-1000 characters'),
    validate_1.validateRequest
], contacts_1.addContactNote);
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, contacts_1.deleteContact);
exports.default = router;
//# sourceMappingURL=contacts.js.map