import { Router } from 'express';
import { getAboutUs, createOrUpdateAboutUs, deleteAboutUs } from '../controllers/aboutUs.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = Router();
// GET /api/about-us - Récupérer le contenu "Qui Sommes-Nous" (public)
router.get('/', getAboutUs);
// POST /api/about-us - Créer ou mettre à jour le contenu "Qui Sommes-Nous" (admin uniquement)
router.post('/', authenticateToken, requireAdmin, createOrUpdateAboutUs);
// DELETE /api/about-us - Supprimer le contenu "Qui Sommes-Nous" (admin uniquement)
router.delete('/', authenticateToken, requireAdmin, deleteAboutUs);
export default router;
//# sourceMappingURL=aboutUs.js.map