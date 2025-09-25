"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamMember_1 = require("../controllers/teamMember");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/team - Get all team members (public)
router.get('/', teamMember_1.getAllTeamMembers);
// GET /api/team/:id - Get single team member (public)
router.get('/:id', teamMember_1.getTeamMember);
// POST /api/team - Create team member (admin only)
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, teamMember_1.createTeamMember);
// PUT /api/team/:id - Update team member (admin only)
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, teamMember_1.updateTeamMember);
// DELETE /api/team/:id - Delete team member (admin only)
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, teamMember_1.deleteTeamMember);
exports.default = router;
//# sourceMappingURL=teamMember.js.map