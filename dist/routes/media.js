"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const media_1 = require("../controllers/media");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
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
router.get('/stats', auth_1.authenticateToken, auth_1.requireAdmin, media_1.getMediaStats);
// @route   POST /api/media/upload
// @access  Private (Admin)
router.post('/upload', auth_1.authenticateToken, auth_1.requireAdmin, media_1.upload.single('file'), // Accept single file with field name 'file'
handleMulterError, media_1.simpleUpload);
// @route   GET /api/media
// @access  Private (Admin)
router.get('/', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('category').optional().isString().withMessage('Invalid category'),
    (0, express_validator_1.query)('mimeType').optional().isString().withMessage('Invalid mime type'),
    (0, express_validator_1.query)('search').optional().isString().withMessage('Invalid search query'),
    validate_1.validateRequest
], media_1.getMediaFiles);
// @route   GET /api/media/:id
// @access  Private (Admin)
router.get('/:id', auth_1.authenticateToken, auth_1.requireAdmin, media_1.getMediaFile);
// @route   PUT /api/media/:id
// @access  Private (Admin)
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1-50 characters'),
    (0, express_validator_1.body)('altText')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Alt text must be less than 200 characters'),
    validate_1.validateRequest
], media_1.updateMediaFile);
// @route   DELETE /api/media/:id
// @access  Private (Admin)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, media_1.deleteMediaFile);
exports.default = router;
//# sourceMappingURL=media.js.map