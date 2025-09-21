import { AboutUs } from '../models/AboutUs.js';
// @desc    Get About Us content
// @route   GET /api/about-us
// @access  Public
export const getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findOne({ isActive: true });
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
// @desc    Create or update About Us content
// @route   POST /api/about-us
// @access  Private (Admin)
export const createOrUpdateAboutUs = async (req, res) => {
    try {
        const { whoAreWeHtml } = req.body;
        if (!whoAreWeHtml || !whoAreWeHtml.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Le contenu "Qui Sommes-Nous" est requis'
            });
        }
        // Create new About Us (pre-save hook will delete existing ones)
        const aboutUs = new AboutUs({
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
// @desc    Delete About Us content
// @route   DELETE /api/about-us
// @access  Private (Admin)
export const deleteAboutUs = async (req, res) => {
    try {
        await AboutUs.deleteMany({});
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
//# sourceMappingURL=aboutUs.js.map