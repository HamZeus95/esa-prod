"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamMembers_1 = require("../controllers/teamMembers");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/team-members - Récupérer tous les membres de l'équipe (public)
router.get('/', teamMembers_1.getAllTeamMembers);
// GET /api/team-members/:id - Récupérer un membre de l'équipe par ID (public)
router.get('/:id', teamMembers_1.getTeamMemberById);
// POST /api/team-members - Créer un membre de l'équipe (admin uniquement)
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, teamMembers_1.createTeamMember);
// PUT /api/team-members/:id - Mettre à jour un membre de l'équipe (admin uniquement)
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, teamMembers_1.updateTeamMember);
// DELETE /api/team-members/:id - Supprimer un membre de l'équipe (admin uniquement)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, teamMembers_1.deleteTeamMember);
exports.default = router;
//# sourceMappingURL=teamMembers.js.map