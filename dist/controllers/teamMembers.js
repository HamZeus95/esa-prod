import { TeamMember } from '../models/TeamMember.js';
// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
export const getAllTeamMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const query = req.query.includeHidden === 'true' ? {} : { isActive: true };
        const teamMembers = await TeamMember.find(query)
            .sort({ order: 1, name: 1 })
            .skip(skip)
            .limit(limit);
        const total = await TeamMember.countDocuments(query);
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
// @desc    Get team member by ID
// @route   GET /api/team-members/:id
// @access  Public
export const getTeamMemberById = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
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
// @desc    Create team member
// @route   POST /api/team-members
// @access  Private (Admin)
export const createTeamMember = async (req, res) => {
    try {
        const { name, position, description, image, email, phone, linkedin, order, isActive, department, hierarchy } = req.body;
        if (!name || !position) {
            return res.status(400).json({
                success: false,
                message: 'Le nom et le poste sont requis'
            });
        }
        const teamMember = new TeamMember({
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
// @desc    Update team member
// @route   PUT /api/team-members/:id
// @access  Private (Admin)
export const updateTeamMember = async (req, res) => {
    try {
        const { name, position, description, image, email, phone, linkedin, order, isActive, department, hierarchy } = req.body;
        const teamMember = await TeamMember.findById(req.params.id);
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
// @desc    Delete team member
// @route   DELETE /api/team-members/:id
// @access  Private (Admin)
export const deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Membre de l\'équipe non trouvé'
            });
        }
        // Check if this team member has subordinates
        const subordinates = await TeamMember.find({ managerId: req.params.id });
        if (subordinates.length > 0) {
            // Update subordinates to remove manager reference
            await TeamMember.updateMany({ managerId: req.params.id }, { $unset: { managerId: 1 } });
        }
        await TeamMember.findByIdAndDelete(req.params.id);
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
//# sourceMappingURL=teamMembers.js.map