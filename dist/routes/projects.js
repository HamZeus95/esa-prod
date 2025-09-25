"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const projects_1 = require("../controllers/projects");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// @route   GET /api/projects/stats
// @access  Private (Admin)
router.get('/stats', auth_1.authenticateToken, auth_1.requireAdmin, projects_1.getProjectStats);
// @route   GET /api/projects
// @access  Public (with optional admin features)
router.get('/', auth_1.optionalAuth, [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validate_1.validateRequest
], projects_1.getProjects);
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', projects_1.getProject);
// @route   POST /api/projects
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
        .isLength({ min: 1, max: 2000 })
        .withMessage('Description is required and must be between 1-2000 characters'),
    (0, express_validator_1.body)('location')
        .notEmpty()
        .trim()
        .withMessage('Location is required'),
    (0, express_validator_1.body)('year')
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be a valid year'),
    (0, express_validator_1.body)('surface')
        .notEmpty()
        .trim()
        .withMessage('Surface is required'),
    (0, express_validator_1.body)('usage')
        .notEmpty()
        .withMessage('usage is required'),
    (0, express_validator_1.body)('structureType')
        .notEmpty()
        .trim()
        .withMessage('Structure type is required'),
    (0, express_validator_1.body)('technicalSolutions')
        .isArray()
        .withMessage('Technical solutions must be an array'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['draft', 'active', 'completed', 'archived'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean'),
    validate_1.validateRequest
], projects_1.createProject);
// @route   PUT /api/projects/:id
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
        .isLength({ min: 1, max: 2000 })
        .withMessage('Description must be between 1-2000 characters'),
    (0, express_validator_1.body)('year')
        .optional()
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be a valid year'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['draft', 'active', 'completed', 'archived'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean'),
    (0, express_validator_1.body)('technicalSolutions')
        .optional()
        .isArray()
        .withMessage('Technical solutions must be an array'),
    validate_1.validateRequest
], projects_1.updateProject);
// @route   PATCH /api/projects/:id/featured
// @access  Private (Admin)
router.patch('/:id/featured', auth_1.authenticateToken, auth_1.requireAdmin, projects_1.toggleFeatured);
// @route   PATCH /api/projects/:id/homepage
// @access  Private (Admin)
router.patch('/:id/homepage', auth_1.authenticateToken, auth_1.requireAdmin, projects_1.toggleHomePage);
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, projects_1.deleteProject);
exports.default = router;
//# sourceMappingURL=projects.js.map