import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getContentByType, updateContentByType } from '../controllers/content.js';
const router = express.Router();
// Public routes - for frontend display
router.get('/:type', getContentByType);
// Protected routes - for admin management
router.put('/:type', authenticateToken, requireAdmin, updateContentByType);
export default router;
//# sourceMappingURL=cms.js.map