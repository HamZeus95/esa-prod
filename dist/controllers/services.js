"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderServices = exports.toggleServiceStatus = exports.deleteService = exports.updateService = exports.createService = exports.getService = exports.getServices = void 0;
const Service_1 = require("../models/Service");
const mongoose_1 = __importDefault(require("mongoose"));
// @desc    Get all services with filtering
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { category, active, search } = req.query;
        // Build filter query
        const filter = {};
        // For public access, only show active services
        if (active !== undefined) {
            filter.active = active === 'true';
        }
        else {
            filter.active = true;
        }
        if (category && category !== 'all') {
            filter.category = { $regex: category, $options: 'i' };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { detailedDescription: { $regex: search, $options: 'i' } }
            ];
        }
        // Get services with pagination
        const services = await Service_1.Service.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
        const total = await Service_1.Service.countDocuments(filter);
        const response = {
            success: true,
            data: services,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            },
            message: 'Services retrieved successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getServices = getServices;
// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
            return;
        }
        const service = await Service_1.Service.findById(id).select('-__v');
        if (!service) {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
            return;
        }
        // For public access, only return active services
        if (!service.active) {
            res.status(404).json({
                success: false,
                message: 'Service not available'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: service,
            message: 'Service retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get service error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getService = getService;
// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res) => {
    try {
        const serviceData = req.body;
        // Create new service
        const service = new Service_1.Service(serviceData);
        await service.save();
        res.status(201).json({
            success: true,
            data: service,
            message: 'Service created successfully'
        });
    }
    catch (error) {
        console.error('Create service error:', error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createService = createService;
// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
            return;
        }
        const service = await Service_1.Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-__v');
        if (!service) {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: service,
            message: 'Service updated successfully'
        });
    }
    catch (error) {
        console.error('Update service error:', error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateService = updateService;
// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
            return;
        }
        const service = await Service_1.Service.findByIdAndDelete(id);
        if (!service) {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteService = deleteService;
// @desc    Toggle service active status
// @route   PATCH /api/services/:id/toggle
// @access  Private (Admin)
const toggleServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
            return;
        }
        const service = await Service_1.Service.findById(id);
        if (!service) {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
            return;
        }
        service.active = !service.active;
        await service.save();
        res.status(200).json({
            success: true,
            data: { active: service.active },
            message: `Service ${service.active ? 'activated' : 'deactivated'} successfully`
        });
    }
    catch (error) {
        console.error('Toggle service status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.toggleServiceStatus = toggleServiceStatus;
// @desc    Reorder services
// @route   PUT /api/services/reorder
// @access  Private (Admin)
const reorderServices = async (req, res) => {
    try {
        const { serviceIds } = req.body;
        if (!Array.isArray(serviceIds)) {
            res.status(400).json({
                success: false,
                message: 'Service IDs must be an array'
            });
            return;
        }
        // Update order for each service
        const updatePromises = serviceIds.map((id, index) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid service ID: ${id}`);
            }
            return Service_1.Service.findByIdAndUpdate(id, { order: index + 1 });
        });
        await Promise.all(updatePromises);
        res.status(200).json({
            success: true,
            message: 'Services reordered successfully'
        });
    }
    catch (error) {
        console.error('Reorder services error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.reorderServices = reorderServices;
//# sourceMappingURL=services.js.map