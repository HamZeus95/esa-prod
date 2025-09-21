import { Router } from 'express';
import { getAllTeamMembers, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamMembers.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = Router();
// GET /api/team-members - Récupérer tous les membres de l'équipe (public)
router.get('/', getAllTeamMembers);
// GET /api/team-members/:id - Récupérer un membre de l'équipe par ID (public)
router.get('/:id', getTeamMemberById);
// POST /api/team-members - Créer un membre de l'équipe (admin uniquement)
router.post('/', authenticateToken, requireAdmin, createTeamMember);
// PUT /api/team-members/:id - Mettre à jour un membre de l'équipe (admin uniquement)
router.put('/:id', authenticateToken, requireAdmin, updateTeamMember);
// DELETE /api/team-members/:id - Supprimer un membre de l'équipe (admin uniquement)
router.delete('/:id', authenticateToken, requireAdmin, deleteTeamMember);
export default router;
//# sourceMappingURL=teamMembers.js.map