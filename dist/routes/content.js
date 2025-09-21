import express from 'express';
import { getContentByType, updateContentByType, getAllContent } from '../controllers/content.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = express.Router();
// @route   GET /api/content
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, getAllContent);
// @route   GET /api/content/:type
// @access  Public
router.get('/:type', getContentByType);
// @route   PUT /api/content/:type
// @access  Private (Admin)
router.put('/:type', authenticateToken, requireAdmin, updateContentByType);
export default router;
//# sourceMappingURL=content.js.map