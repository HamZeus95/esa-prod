import { Router } from 'express';
import { getAboutContent, createOrUpdateAboutContent, deleteAboutContent } from '../controllers/aboutContent.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = Router();
// GET /api/about-content - Get about content (public)
router.get('/', getAboutContent);
// POST /api/about-content - Create or update about content (admin only)  
router.post('/', authenticateToken, requireAdmin, createOrUpdateAboutContent);
// DELETE /api/about-content - Delete about content (admin only)
router.delete('/', authenticateToken, requireAdmin, deleteAboutContent);
export default router;
//# sourceMappingURL=aboutContent.js.map