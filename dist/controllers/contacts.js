"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactStats = exports.deleteContact = exports.addContactNote = exports.updateContactPriority = exports.updateContactStatus = exports.getContact = exports.getContacts = exports.submitContact = void 0;
const ContactMessage_1 = require("../models/ContactMessage");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Email transporter configuration
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false // Allow self-signed certificates
        }
    });
};
// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
    try {
        const { name, email, projectType, message } = req.body;
        // Create contact message
        const contactMessage = new ContactMessage_1.ContactMessage({
            name,
            email,
            projectType,
            message,
            status: 'unread',
            priority: 'medium',
            notes: []
        });
        await contactMessage.save();
        // Send email notification to admin
        const admins = await User_1.User.find({ role: 'admin', status: 'active' });
        try {
            const transporter = createTransporter();
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: admins.map(admin => admin.email).join(', '),
                subject: `New Contact Form Submission - ${projectType}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        `
            };
            await transporter.sendMail(mailOptions);
        }
        catch (emailError) {
            console.error('Email notification error:', emailError);
            // Don't fail the request if email fails
        }
        res.status(201).json({
            success: true,
            data: {
                id: contactMessage._id,
                submittedAt: contactMessage.createdAt
            },
            message: 'Your message has been submitted successfully. We will get back to you soon!'
        });
    }
    catch (error) {
        console.error('Submit contact error:', error);
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
exports.submitContact = submitContact;
// @desc    Get all contact messages with pagination and filtering
// @route   GET /api/contacts
// @access  Private (Admin)
const getContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status, priority, projectType, search } = req.query;
        // Build filter query
        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (priority && priority !== 'all') {
            filter.priority = priority;
        }
        if (projectType && projectType !== 'all') {
            filter.projectType = projectType;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }
        // Get contacts with pagination
        const contacts = await ContactMessage_1.ContactMessage.find(filter)
            .sort({ priority: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
        const total = await ContactMessage_1.ContactMessage.countDocuments(filter);
        const response = {
            success: true,
            data: contacts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            },
            message: 'Contacts retrieved successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getContacts = getContacts;
// @desc    Get single contact message by ID
// @route   GET /api/contacts/:id
// @access  Private (Admin)
const getContact = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
            return;
        }
        const contact = await ContactMessage_1.ContactMessage.findById(id).select('-__v');
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
            return;
        }
        // Mark as read if it was unread
        if (contact.status === 'unread') {
            contact.status = 'read';
            await contact.save();
        }
        res.status(200).json({
            success: true,
            data: contact,
            message: 'Contact retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getContact = getContact;
// @desc    Update contact message status
// @route   PATCH /api/contacts/:id/status
// @access  Private (Admin)
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
            return;
        }
        const validStatuses = ['unread', 'read', 'replied', 'archived'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
            return;
        }
        const contact = await ContactMessage_1.ContactMessage.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).select('-__v');
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: contact,
            message: 'Contact status updated successfully'
        });
    }
    catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateContactStatus = updateContactStatus;
// @desc    Update contact priority
// @route   PATCH /api/contacts/:id/priority
// @access  Private (Admin)
const updateContactPriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
            return;
        }
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            res.status(400).json({
                success: false,
                message: 'Invalid priority'
            });
            return;
        }
        const contact = await ContactMessage_1.ContactMessage.findByIdAndUpdate(id, { priority }, { new: true, runValidators: true }).select('-__v');
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: contact,
            message: 'Contact priority updated successfully'
        });
    }
    catch (error) {
        console.error('Update contact priority error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateContactPriority = updateContactPriority;
// @desc    Add note to contact
// @route   POST /api/contacts/:id/notes
// @access  Private (Admin)
const addContactNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        const user = req.user;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
            return;
        }
        if (!note || note.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Note content is required'
            });
            return;
        }
        const contact = await ContactMessage_1.ContactMessage.findById(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
            return;
        }
        const newNote = {
            id: new mongoose_1.default.Types.ObjectId().toString(),
            content: note.trim(),
            author: user.name,
            createdAt: new Date()
        };
        contact.notes.push(newNote);
        await contact.save();
        res.status(201).json({
            success: true,
            data: newNote,
            message: 'Note added successfully'
        });
    }
    catch (error) {
        console.error('Add contact note error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.addContactNote = addContactNote;
// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
            return;
        }
        const contact = await ContactMessage_1.ContactMessage.findByIdAndDelete(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteContact = deleteContact;
// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private (Admin)
const getContactStats = async (req, res) => {
    try {
        const totalContacts = await ContactMessage_1.ContactMessage.countDocuments();
        const unreadContacts = await ContactMessage_1.ContactMessage.countDocuments({ status: 'unread' });
        const recentContacts = await ContactMessage_1.ContactMessage.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        const statusStats = await ContactMessage_1.ContactMessage.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const priorityStats = await ContactMessage_1.ContactMessage.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);
        const statusCounts = statusStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});
        const priorityCounts = priorityStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});
        res.status(200).json({
            success: true,
            data: {
                total: totalContacts,
                unread: unreadContacts,
                recentWeek: recentContacts,
                byStatus: statusCounts,
                byPriority: priorityCounts
            },
            message: 'Contact statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getContactStats = getContactStats;
//# sourceMappingURL=contacts.js.map