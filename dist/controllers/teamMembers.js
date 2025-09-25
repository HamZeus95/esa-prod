"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = exports.updateTeamMember = exports.createTeamMember = exports.getTeamMemberById = exports.getAllTeamMembers = void 0;
const TeamMember_1 = require("../models/TeamMember");
// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
const getAllTeamMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const query = req.query.includeHidden === 'true' ? {} : { isActive: true };
        const teamMembers = await TeamMember_1.TeamMember.find(query)
            .sort({ order: 1, name: 1 })
            .skip(skip)
            .limit(limit);
        const total = await TeamMember_1.TeamMember.countDocuments(query);
        res.status(200).json({
            success: true,
            data: teamMembers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    }
    catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des membres de l\'équipe'
        });
    }
};
exports.getAllTeamMembers = getAllTeamMembers;
// @desc    Get team member by ID
// @route   GET /api/team-members/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
    try {
        const teamMember = await TeamMember_1.TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Membre de l\'équipe non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            data: teamMember
        });
    }
    catch (error) {
        console.error('Get team member by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du membre de l\'équipe'
        });
    }
};
exports.getTeamMemberById = getTeamMemberById;
// @desc    Create team member
// @route   POST /api/team-members
// @access  Private (Admin)
const createTeamMember = async (req, res) => {
    try {
        const { name, position, description, image, email, phone, linkedin, order, isActive, department, hierarchy } = req.body;
        if (!name || !position) {
            return res.status(400).json({
                success: false,
                message: 'Le nom et le poste sont requis'
            });
        }
        const teamMember = new TeamMember_1.TeamMember({
            name: name.trim(),
            position: position.trim(),
            description: description?.trim(),
            image: image?.trim(),
            email: email?.trim(),
            phone: phone?.trim(),
            linkedin: linkedin?.trim(),
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true,
            department: department?.trim(),
            hierarchy: hierarchy || 'engineer'
        });
        await teamMember.save();
        res.status(201).json({
            success: true,
            data: teamMember,
            message: 'Membre de l\'équipe créé avec succès'
        });
    }
    catch (error) {
        console.error('Create team member error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la création du membre de l\'équipe'
        });
    }
};
exports.createTeamMember = createTeamMember;
// @desc    Update team member
// @route   PUT /api/team-members/:id
// @access  Private (Admin)
const updateTeamMember = async (req, res) => {
    try {
        const { name, position, description, image, email, phone, linkedin, order, isActive, department, hierarchy } = req.body;
        const teamMember = await TeamMember_1.TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Membre de l\'équipe non trouvé'
            });
        }
        // Update fields
        if (name)
            teamMember.name = name.trim();
        if (position)
            teamMember.position = position.trim();
        if (description !== undefined)
            teamMember.description = description?.trim();
        if (image !== undefined)
            teamMember.image = image?.trim();
        if (email !== undefined)
            teamMember.email = email?.trim();
        if (phone !== undefined)
            teamMember.phone = phone?.trim();
        if (linkedin !== undefined)
            teamMember.linkedin = linkedin?.trim();
        if (order !== undefined)
            teamMember.order = order;
        if (isActive !== undefined)
            teamMember.isActive = isActive;
        if (department !== undefined)
            teamMember.department = department?.trim();
        if (hierarchy !== undefined)
            teamMember.hierarchy = hierarchy;
        await teamMember.save();
        res.status(200).json({
            success: true,
            data: teamMember,
            message: 'Membre de l\'équipe mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour du membre de l\'équipe'
        });
    }
};
exports.updateTeamMember = updateTeamMember;
// @desc    Delete team member
// @route   DELETE /api/team-members/:id
// @access  Private (Admin)
const deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember_1.TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Membre de l\'équipe non trouvé'
            });
        }
        // Check if this team member has subordinates
        const subordinates = await TeamMember_1.TeamMember.find({ managerId: req.params.id });
        if (subordinates.length > 0) {
            // Update subordinates to remove manager reference
            await TeamMember_1.TeamMember.updateMany({ managerId: req.params.id }, { $unset: { managerId: 1 } });
        }
        await TeamMember_1.TeamMember.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: `Membre de l'équipe supprimé avec succès${subordinates.length > 0 ? '. Leurs subordonnés ont été détachés.' : ''}`
        });
    }
    catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du membre de l\'équipe'
        });
    }
};
exports.deleteTeamMember = deleteTeamMember;
//# sourceMappingURL=teamMembers.js.map