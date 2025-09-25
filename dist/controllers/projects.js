"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectStats = exports.toggleHomePage = exports.toggleFeatured = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const Project_1 = require("../models/Project");
const mongoose_1 = __importDefault(require("mongoose"));
// @desc    Get all projects with pagination and filtering
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status, featured, year, structureType, search, isHomePage } = req.query;
        // Build filter query
        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        else {
            // For public access, only show active projects
            // For authenticated admin users, show all projects
            if (!req.user || req.user.role !== 'admin') {
                filter.status = 'active';
            }
        }
        // if (featured !== undefined) {
        //   filter.featured = featured === 'true';
        // }
        if (isHomePage !== undefined) {
            filter.isHomePage = isHomePage === 'true';
        }
        if (year) {
            filter.year = parseInt(year);
        }
        if (structureType) {
            filter.structureType = { $regex: structureType, $options: 'i' };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        console.log("project.ts ~ filter:", filter);
        // Get projects with pagination
        const projects = await Project_1.Project.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
        const total = await Project_1.Project.countDocuments(filter);
        const response = {
            success: true,
            data: projects,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            },
            message: 'Projects retrieved successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getProjects = getProjects;
// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
            return;
        }
        const project = await Project_1.Project.findById(id).select('-__v');
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: project,
            message: 'Project retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getProject = getProject;
// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
    try {
        const projectData = req.body;
        console.log('🏗️ Creating project with data:', {
            title: projectData.title,
            images: projectData.images?.length || 0,
            imagesData: projectData.images
        });
        // Create new project
        const project = new Project_1.Project(projectData);
        await project.save();
        console.log('✅ Project saved with images:', project.images?.length || 0);
        res.status(201).json({
            success: true,
            data: project,
            message: 'Project created successfully'
        });
    }
    catch (error) {
        console.error('Create project error:', error);
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
exports.createProject = createProject;
// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
            return;
        }
        const project = await Project_1.Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-__v');
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: project,
            message: 'Project updated successfully'
        });
    }
    catch (error) {
        console.error('Update project error:', error);
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
exports.updateProject = updateProject;
// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
            return;
        }
        const project = await Project_1.Project.findByIdAndDelete(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        // TODO: Delete associated images from storage
        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteProject = deleteProject;
// @desc    Toggle project featured status
// @route   PATCH /api/projects/:id/featured
// @access  Private (Admin)
const toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
            return;
        }
        const project = await Project_1.Project.findById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        project.featured = !project.featured;
        await project.save();
        res.status(200).json({
            success: true,
            data: { featured: project.featured },
            message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`
        });
    }
    catch (error) {
        console.error('Toggle featured error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.toggleFeatured = toggleFeatured;
// @desc Toggle isHomePage status
// @route PATCH /api/projects/:id/homepage
// @access Private (Admin)
const toggleHomePage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
            return;
        }
        const project = await Project_1.Project.findById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        project.isHomePage = !project.isHomePage;
        await project.save();
        res.status(200).json({
            success: true,
            data: { isHomePage: project.isHomePage },
            message: `Project ${project.isHomePage ? 'added to' : 'removed from'} home page successfully`
        });
    }
    catch (error) {
        if (error.message.includes('Maximum 6 projects can be featured') ||
            error.message.includes('Maximum 4 projets peuvent être affichés')) {
            res.status(400).json({
                error: 'Validation Error',
                message: error.message,
                type: 'LIMIT_EXCEEDED'
            });
        }
    }
};
exports.toggleHomePage = toggleHomePage;
// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private (Admin)
const getProjectStats = async (req, res) => {
    try {
        const stats = await Project_1.Project.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const totalProjects = await Project_1.Project.countDocuments();
        const featuredProjects = await Project_1.Project.countDocuments({ featured: true });
        const statusCounts = stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});
        res.status(200).json({
            success: true,
            data: {
                total: totalProjects,
                featured: featuredProjects,
                byStatus: statusCounts
            },
            message: 'Project statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get project stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getProjectStats = getProjectStats;
//# sourceMappingURL=projects.js.map