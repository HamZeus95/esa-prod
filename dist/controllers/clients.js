"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClient = exports.getClients = void 0;
const Client_1 = require("../models/Client");
// @desc    Get all clients/partners
// @route   GET /api/clients
// @access  Public
const getClients = async (req, res) => {
    try {
        const { type, active } = req.query;
        // Build filter query
        const filter = {};
        if (type && (type === 'client' || type === 'partner')) {
            filter.type = type;
        }
        if (active !== undefined) {
            filter.isActive = active === 'true';
        }
        else {
            // By default, only show active clients for public access
            filter.isActive = true;
        }
        const clients = await Client_1.Client.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .lean();
        const response = {
            success: true,
            data: clients,
            message: 'Clients retrieved successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving clients'
        });
    }
};
exports.getClients = getClients;
// @desc    Get single client/partner
// @route   GET /api/clients/:id
// @access  Public
const getClient = async (req, res) => {
    try {
        const client = await Client_1.Client.findById(req.params.id).lean();
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        const response = {
            success: true,
            data: client,
            message: 'Client retrieved successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get client error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving client'
        });
    }
};
exports.getClient = getClient;
// @desc    Create new client/partner
// @route   POST /api/clients
// @access  Private (Admin)
const createClient = async (req, res) => {
    try {
        const client = await Client_1.Client.create(req.body);
        const response = {
            success: true,
            data: client,
            message: 'Client created successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Create client error:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Server error while creating client'
        });
    }
};
exports.createClient = createClient;
// @desc    Update client/partner
// @route   PUT /api/clients/:id
// @access  Private (Admin)
const updateClient = async (req, res) => {
    try {
        const client = await Client_1.Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        const response = {
            success: true,
            data: client,
            message: 'Client updated successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Update client error:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Server error while updating client'
        });
    }
};
exports.updateClient = updateClient;
// @desc    Delete client/partner
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
const deleteClient = async (req, res) => {
    try {
        const client = await Client_1.Client.findByIdAndDelete(req.params.id);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        const response = {
            success: true,
            data: null,
            message: 'Client deleted successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting client'
        });
    }
};
exports.deleteClient = deleteClient;
//# sourceMappingURL=clients.js.map