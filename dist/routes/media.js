import express from 'express';
import { body, query } from 'express-validator';
import { simpleUpload, getMediaFiles, getMediaFile, updateMediaFile, deleteMediaFile, getMediaStats, upload } from '../controllers/media.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
const router = express.Router();
// Custom error handler for multer
const handleMulterError = (err, req, res, next) => {
    console.log('Multer error:', err);
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            console.log('Unexpected file field, but allowing it through...');
            // Don't block the request, let it continue
            return next();
        }
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error'
        });
    }
    next();
};
// @route   GET /api/media/stats
// @access  Private (Admin)
router.get('/stats', authenticateToken, requireAdmin, getMediaStats);
// @route   POST /api/media/upload
// @access  Private (Admin)
router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), // Accept single file with field name 'file'
handleMulterError, simpleUpload);
// @route   GET /api/media
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isString().withMessage('Invalid category'),
    query('mimeType').optional().isString().withMessage('Invalid mime type'),
    query('search').optional().isString().withMessage('Invalid search query'),
    validateRequest
], getMediaFiles);
// @route   GET /api/media/:id
// @access  Private (Admin)
router.get('/:id', authenticateToken, requireAdmin, getMediaFile);
// @route   PUT /api/media/:id
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, [
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1-50 characters'),
    body('altText')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Alt text must be less than 200 characters'),
    validateRequest
], updateMediaFile);
// @route   DELETE /api/media/:id
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteMediaFile);
export default router;
//# sourceMappingURL=media.js.map