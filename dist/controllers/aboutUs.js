"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAboutUs = exports.createOrUpdateAboutUs = exports.getAboutUs = void 0;
const AboutUs_1 = require("../models/AboutUs");
// @desc    Get About Us content
// @route   GET /api/about-us
// @access  Public
const getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs_1.AboutUs.findOne({ isActive: true });
        res.status(200).json({
            success: true,
            data: aboutUs
        });
    }
    catch (error) {
        console.error('Get about us error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du contenu "Qui Sommes-Nous"'
        });
    }
};
exports.getAboutUs = getAboutUs;
// @desc    Create or update About Us content
// @route   POST /api/about-us
// @access  Private (Admin)
const createOrUpdateAboutUs = async (req, res) => {
    try {
        const { whoAreWeHtml } = req.body;
        if (!whoAreWeHtml || !whoAreWeHtml.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Le contenu "Qui Sommes-Nous" est requis'
            });
        }
        // Create new About Us (pre-save hook will delete existing ones)
        const aboutUs = new AboutUs_1.AboutUs({
            whoAreWeHtml: whoAreWeHtml.trim(),
            isActive: true
        });
        await aboutUs.save();
        res.status(200).json({
            success: true,
            data: aboutUs,
            message: 'Contenu "Qui Sommes-Nous" mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Create/Update about us error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour du contenu "Qui Sommes-Nous"'
        });
    }
};
exports.createOrUpdateAboutUs = createOrUpdateAboutUs;
// @desc    Delete About Us content
// @route   DELETE /api/about-us
// @access  Private (Admin)
const deleteAboutUs = async (req, res) => {
    try {
        await AboutUs_1.AboutUs.deleteMany({});
        res.status(200).json({
            success: true,
            message: 'Contenu "Qui Sommes-Nous" supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Delete about us error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du contenu "Qui Sommes-Nous"'
        });
    }
};
exports.deleteAboutUs = deleteAboutUs;
//# sourceMappingURL=aboutUs.js.map