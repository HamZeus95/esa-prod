import { TeamMember } from '../models/TeamMember.js';
// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getAllTeamMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const hierarchy = req.query.hierarchy;
        const isActive = req.query.isActive === 'true';
        const query = {};
        if (hierarchy)
            query.hierarchy = hierarchy;
        if (req.query.isActive !== undefined)
            query.isActive = isActive;
        const startIndex = (page - 1) * limit;
        const total = await TeamMember.countDocuments(query);
        const teamMembers = await TeamMember.find(query)
            .sort({ hierarchy: 1, order: 1 })
            .limit(limit)
            .skip(startIndex);
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
// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
export const getTeamMember = async (req, res) => {
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
        console.error('Get team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du membre de l\'équipe'
        });
    }
};
// @desc    Create team member
// @route   POST /api/team
// @access  Private (Admin)
export const createTeamMember = async (req, res) => {
    try {
        const { name, position, description, image, email, phone, linkedin, order, isActive, department, hierarchy } = req.body;
        const teamMember = new TeamMember({
            name,
            position,
            description,
            image,
            email,
            phone,
            linkedin,
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true,
            department,
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
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du membre de l\'équipe'
        });
    }
};
// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private (Admin)
export const updateTeamMember = async (req, res) => {
    try {
        const { name, position, description, image, email, phone, linkedin, order, isActive, department, hierarchy } = req.body;
        const teamMember = await TeamMember.findByIdAndUpdate(req.params.id, {
            name,
            position,
            description,
            image,
            email,
            phone,
            linkedin,
            order,
            isActive,
            department,
            hierarchy
        }, { new: true, runValidators: true });
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Membre de l\'équipe non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            data: teamMember,
            message: 'Membre de l\'équipe mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Update team member error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du membre de l\'équipe'
        });
    }
};
// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private (Admin)
export const deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Membre de l\'équipe non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Membre de l\'équipe supprimé avec succès'
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
//# sourceMappingURL=teamMember.js.map