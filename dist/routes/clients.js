"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const clients_1 = require("../controllers/clients");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// @route   GET /api/clients
// @access  Public
router.get('/', clients_1.getClients);
// @route   GET /api/clients/:id
// @access  Public
router.get('/:id', clients_1.getClient);
// @route   POST /api/clients
// @access  Private (Admin)
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name is required and must be between 1-100 characters'),
    (0, express_validator_1.body)('image')
        .optional()
        .isString()
        .trim()
        .withMessage('Image URL must be a string'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['client', 'partner'])
        .withMessage('Type must be either client or partner'),
    (0, express_validator_1.body)('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    validate_1.validateRequest
], clients_1.createClient);
// @route   PUT /api/clients/:id
// @access  Private (Admin)
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1-100 characters'),
    (0, express_validator_1.body)('image')
        .optional()
        .isString()
        .trim()
        .withMessage('Image must be a string'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['client', 'partner'])
        .withMessage('Type must be either client or partner'),
    (0, express_validator_1.body)('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    validate_1.validateRequest
], clients_1.updateClient);
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, clients_1.deleteClient);
exports.default = router;
//# sourceMappingURL=clients.js.map