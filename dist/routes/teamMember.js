import { Router } from 'express';
import { getAllTeamMembers, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamMember.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = Router();
// GET /api/team - Get all team members (public)
router.get('/', getAllTeamMembers);
// GET /api/team/:id - Get single team member (public)
router.get('/:id', getTeamMember);
// POST /api/team - Create team member (admin only)
router.post('/', authenticateToken, requireAdmin, createTeamMember);
// PUT /api/team/:id - Update team member (admin only)
router.put('/:id', authenticateToken, requireAdmin, updateTeamMember);
// DELETE /api/team/:id - Delete team member (admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteTeamMember);
export default router;
//# sourceMappingURL=teamMember.js.map