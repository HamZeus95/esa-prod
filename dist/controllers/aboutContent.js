import { AboutContent } from '../models/AboutContent.js';
// @desc    Get about content
// @route   GET /api/about-content
// @access  Public
export const getAboutContent = async (req, res) => {
    try {
        const aboutContent = await AboutContent.findOne({ isActive: true });
        res.status(200).json({
            success: true,
            data: aboutContent
        });
    }
    catch (error) {
        console.error('Get about content error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du contenu "À propos"'
        });
    }
};
// @desc    Create or update about content
// @route   POST /api/about-content
// @access  Private (Admin)
export const createOrUpdateAboutContent = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Le contenu est requis'
            });
        }
        // Create new about content (pre-save hook will delete existing ones)
        const aboutContent = new AboutContent({
            content: content.trim(),
            isActive: true
        });
        await aboutContent.save();
        res.status(200).json({
            success: true,
            data: aboutContent,
            message: 'Contenu "À propos" mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Create/Update about content error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour du contenu "À propos"'
        });
    }
};
// @desc    Delete about content
// @route   DELETE /api/about-content
// @access  Private (Admin)
export const deleteAboutContent = async (req, res) => {
    try {
        await AboutContent.deleteMany({});
        res.status(200).json({
            success: true,
            message: 'Contenu "À propos" supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Delete about content error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du contenu "À propos"'
        });
    }
};
//# sourceMappingURL=aboutContent.js.map