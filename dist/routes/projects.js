import express from 'express';
import { body, query } from 'express-validator';
import { getProjects, getProject, createProject, updateProject, deleteProject, toggleFeatured, getProjectStats, toggleHomePage } from '../controllers/projects.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
const router = express.Router();
// @route   GET /api/projects/stats
// @access  Private (Admin)
router.get('/stats', authenticateToken, requireAdmin, getProjectStats);
// @route   GET /api/projects
// @access  Public (with optional admin features)
router.get('/', optionalAuth, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validateRequest
], getProjects);
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', getProject);
// @route   POST /api/projects
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
        .isLength({ min: 1, max: 2000 })
        .withMessage('Description is required and must be between 1-2000 characters'),
    body('location')
        .notEmpty()
        .trim()
        .withMessage('Location is required'),
    body('year')
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be a valid year'),
    body('surface')
        .notEmpty()
        .trim()
        .withMessage('Surface is required'),
    body('usage')
        .notEmpty()
        .withMessage('usage is required'),
    body('structureType')
        .notEmpty()
        .trim()
        .withMessage('Structure type is required'),
    body('technicalSolutions')
        .isArray()
        .withMessage('Technical solutions must be an array'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'completed', 'archived'])
        .withMessage('Invalid status'),
    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean'),
    validateRequest
], createProject);
// @route   PUT /api/projects/:id
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
        .isLength({ min: 1, max: 2000 })
        .withMessage('Description must be between 1-2000 characters'),
    body('year')
        .optional()
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be a valid year'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'completed', 'archived'])
        .withMessage('Invalid status'),
    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean'),
    body('technicalSolutions')
        .optional()
        .isArray()
        .withMessage('Technical solutions must be an array'),
    validateRequest
], updateProject);
// @route   PATCH /api/projects/:id/featured
// @access  Private (Admin)
router.patch('/:id/featured', authenticateToken, requireAdmin, toggleFeatured);
// @route   PATCH /api/projects/:id/homepage
// @access  Private (Admin)
router.patch('/:id/homepage', authenticateToken, requireAdmin, toggleHomePage);
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteProject);
export default router;
//# sourceMappingURL=projects.js.map