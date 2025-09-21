import { Router } from 'express';
import { getHeroVideo, createOrUpdateHeroVideo, deleteHeroVideo } from '../controllers/heroVideo.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = Router();
// GET /api/hero-video - Récupérer la vidéo hero (public)
router.get('/', getHeroVideo);
// POST /api/hero-video - Créer ou mettre à jour la vidéo hero (admin uniquement)
router.post('/', authenticateToken, requireAdmin, createOrUpdateHeroVideo);
// DELETE /api/hero-video - Supprimer la vidéo hero (admin uniquement)
router.delete('/', authenticateToken, requireAdmin, deleteHeroVideo);
export default router;
//# sourceMappingURL=heroVideo.js.map