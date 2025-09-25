"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceCategories = exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getAllServices = void 0;
const Service_1 = require("../models/Service");
// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const active = req.query.active;
        const startIndex = (page - 1) * limit;
        // Build query
        const query = {};
        if (category)
            query.category = category;
        if (active !== undefined)
            query.active = active === 'true';
        const total = await Service_1.Service.countDocuments(query);
        const services = await Service_1.Service.find(query)
            .sort({ order: 1, createdAt: -1 })
            .limit(limit)
            .skip(startIndex);
        res.status(200).json({
            success: true,
            data: services,
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
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des services',
            error: error.message
        });
    }
};
exports.getAllServices = getAllServices;
// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service_1.Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            data: service
        });
    }
    catch (error) {
        console.error('Get service by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du service',
            error: error.message
        });
    }
};
exports.getServiceById = getServiceById;
// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
    try {
        const { title, description, detailedDescription, category, features, images, order, active } = req.body;
        console.log('🔧 Creating service with data:', {
            title,
            category,
            features: features?.length || 0,
            images: images?.length || 0,
            imagesData: images
        });
        // Validation
        if (!title || !description || !detailedDescription || !category) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être fournis'
            });
        }
        // Create service
        const service = new Service_1.Service({
            title: title.trim(),
            description: description.trim(),
            detailedDescription: detailedDescription.trim(),
            category,
            features: features || [],
            images: images || [], // Add images support
            order: order || 0,
            active: active !== undefined ? active : true
        });
        const savedService = await service.save();
        console.log('✅ Service saved with images:', savedService.images?.length || 0);
        res.status(201).json({
            success: true,
            data: savedService,
            message: 'Service créé avec succès'
        });
    }
    catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du service',
            error: error.message
        });
    }
};
exports.createService = createService;
// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
    try {
        const { title, description, detailedDescription, category, features, images, order, active } = req.body;
        const service = await Service_1.Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }
        // Update fields
        if (title)
            service.title = title.trim();
        if (description)
            service.description = description.trim();
        if (detailedDescription)
            service.detailedDescription = detailedDescription.trim();
        if (category)
            service.category = category;
        if (features !== undefined)
            service.features = features;
        if (images !== undefined)
            service.images = images; // Add images support
        if (order !== undefined)
            service.order = order;
        if (active !== undefined)
            service.active = active;
        const updatedService = await service.save();
        res.status(200).json({
            success: true,
            data: updatedService,
            message: 'Service mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du service',
            error: error.message
        });
    }
};
exports.updateService = updateService;
// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
    try {
        const service = await Service_1.Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }
        await Service_1.Service.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            data: null,
            message: 'Service supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du service',
            error: error.message
        });
    }
};
exports.deleteService = deleteService;
// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
const getServiceCategories = async (req, res) => {
    try {
        const categories = [
            'Structural Design',
            'Dynamic Structures',
            'Execution Plans',
            'Manufacturing Plans',
            'Project Management',
            'Technical Solutions'
        ];
        res.status(200).json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error('Get service categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des catégories',
            error: error.message
        });
    }
};
exports.getServiceCategories = getServiceCategories;
//# sourceMappingURL=service.js.map