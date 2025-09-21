import { ExpertiseDomain } from '../models/ExpertiseDomain.js';
// @desc    Get all expertise domains
// @route   GET /api/expertise-domains
// @access  Public
export const getAllExpertiseDomains = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const isActive = req.query.isActive;
        const startIndex = (page - 1) * limit;
        // Build query
        const query = {};
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        const total = await ExpertiseDomain.countDocuments(query);
        const domains = await ExpertiseDomain.find(query)
            .sort({ order: 1, createdAt: -1 })
            .limit(limit)
            .skip(startIndex);
        res.status(200).json({
            success: true,
            data: domains,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNext: startIndex + limit < total,
                hasPrev: page > 1
            }
        });
    }
    catch (error) {
        console.error('Get expertise domains error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des domaines d\'expertise',
            error: error.message
        });
    }
};
// @desc    Get single expertise domain
// @route   GET /api/expertise-domains/:id
// @access  Public
export const getExpertiseDomainById = async (req, res) => {
    try {
        const domain = await ExpertiseDomain.findById(req.params.id);
        if (!domain) {
            return res.status(404).json({
                success: false,
                message: 'Domaine d\'expertise non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            data: domain
        });
    }
    catch (error) {
        console.error('Get expertise domain by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du domaine d\'expertise',
            error: error.message
        });
    }
};
// @desc    Create expertise domain
// @route   POST /api/expertise-domains
// @access  Private/Admin
export const createExpertiseDomain = async (req, res) => {
    try {
        const { title, description, icon, iconType, order, isActive } = req.body;
        // Validation
        if (!title || !description || !icon) {
            return res.status(400).json({
                success: false,
                message: 'Le titre, la description et l\'icône sont obligatoires'
            });
        }
        // Create expertise domain
        const domain = new ExpertiseDomain({
            title: title.trim(),
            description: description.trim(),
            icon: icon.trim(),
            iconType: iconType || 'icon',
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true
        });
        const savedDomain = await domain.save();
        res.status(201).json({
            success: true,
            data: savedDomain,
            message: 'Domaine d\'expertise créé avec succès'
        });
    }
    catch (error) {
        console.error('Create expertise domain error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du domaine d\'expertise',
            error: error.message
        });
    }
};
// @desc    Update expertise domain
// @route   PUT /api/expertise-domains/:id
// @access  Private/Admin
export const updateExpertiseDomain = async (req, res) => {
    try {
        const { title, description, icon, iconType, order, isActive } = req.body;
        const domain = await ExpertiseDomain.findById(req.params.id);
        if (!domain) {
            return res.status(404).json({
                success: false,
                message: 'Domaine d\'expertise non trouvé'
            });
        }
        // Update fields
        if (title)
            domain.title = title.trim();
        if (description)
            domain.description = description.trim();
        if (icon)
            domain.icon = icon.trim();
        if (iconType)
            domain.iconType = iconType;
        if (order !== undefined)
            domain.order = order;
        if (isActive !== undefined)
            domain.isActive = isActive;
        const updatedDomain = await domain.save();
        res.status(200).json({
            success: true,
            data: updatedDomain,
            message: 'Domaine d\'expertise mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Update expertise domain error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du domaine d\'expertise',
            error: error.message
        });
    }
};
// @desc    Delete expertise domain
// @route   DELETE /api/expertise-domains/:id
// @access  Private/Admin
export const deleteExpertiseDomain = async (req, res) => {
    try {
        const domain = await ExpertiseDomain.findById(req.params.id);
        if (!domain) {
            return res.status(404).json({
                success: false,
                message: 'Domaine d\'expertise non trouvé'
            });
        }
        await ExpertiseDomain.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            data: null,
            message: 'Domaine d\'expertise supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Delete expertise domain error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du domaine d\'expertise',
            error: error.message
        });
    }
};
//# sourceMappingURL=expertiseDomain.js.map