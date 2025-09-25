"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const services_1 = require("../controllers/services");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// @route   PUT /api/services/reorder
// @access  Private (Admin)
router.put('/reorder', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('serviceIds')
        .isArray()
        .withMessage('Service IDs must be an array'),
    validate_1.validateRequest
], services_1.reorderServices);
// @route   GET /api/services
// @access  Public
router.get('/', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('category').optional().isString().withMessage('Invalid category'),
    (0, express_validator_1.query)('active').optional().isBoolean().withMessage('Active must be a boolean'),
    (0, express_validator_1.query)('search').optional().isString().withMessage('Invalid search query'),
    validate_1.validateRequest
], services_1.getServices);
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', services_1.getService);
// @route   POST /api/services
// @access  Private (Admin)
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title is required and must be between 1-200 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description is required and must be between 1-500 characters'),
    (0, express_validator_1.body)('detailedDescription')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Detailed description is required and must be between 1-2000 characters'),
    (0, express_validator_1.body)('category')
        .notEmpty()
        .trim()
        .withMessage('Category is required'),
    (0, express_validator_1.body)('features')
        .isArray()
        .withMessage('Features must be an array'),
    (0, express_validator_1.body)('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    (0, express_validator_1.body)('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),
    validate_1.validateRequest
], services_1.createService);
// @route   PUT /api/services/:id
// @access  Private (Admin)
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1-200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1-500 characters'),
    (0, express_validator_1.body)('detailedDescription')
        .optional()
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Detailed description must be between 1-2000 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isString()
        .withMessage('Category is required'),
    (0, express_validator_1.body)('features')
        .optional()
        .isArray()
        .withMessage('Features must be an array'),
    (0, express_validator_1.body)('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    (0, express_validator_1.body)('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),
    validate_1.validateRequest
], services_1.updateService);
// @route   PATCH /api/services/:id/toggle
// @access  Private (Admin)
router.patch('/:id/toggle', auth_1.authenticateToken, auth_1.requireAdmin, services_1.toggleServiceStatus);
// @route   DELETE /api/services/:id
// @access  Private (Admin)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, services_1.deleteService);
exports.default = router;
//# sourceMappingURL=services.js.map