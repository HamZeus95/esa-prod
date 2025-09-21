import { HeroVideo } from '../models/HeroVideo.js';
// @desc    Get hero video
// @route   GET /api/hero-video
// @access  Public
export const getHeroVideo = async (req, res) => {
    try {
        const heroVideo = await HeroVideo.findOne({ isActive: true });
        res.status(200).json({
            success: true,
            data: heroVideo
        });
    }
    catch (error) {
        console.error('Get hero video error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la vidéo hero'
        });
    }
};
// @desc    Create or update hero video
// @route   POST /api/hero-video
// @access  Private (Admin)
export const createOrUpdateHeroVideo = async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnailUrl, duration } = req.body;
        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Le titre est requis'
            });
        }
        if (!videoUrl) {
            return res.status(400).json({
                success: false,
                message: 'La vidéo est requise'
            });
        }
        // Create new hero video (pre-save hook will delete existing ones)
        const heroVideo = new HeroVideo({
            title,
            description: description || '',
            videoUrl,
            thumbnailUrl: thumbnailUrl || '',
            duration,
            isActive: true
        });
        await heroVideo.save();
        res.status(200).json({
            success: true,
            data: heroVideo,
            message: 'Vidéo hero mise à jour avec succès'
        });
    }
    catch (error) {
        console.error('Create/Update hero video error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour de la vidéo hero'
        });
    }
};
// @desc    Delete hero video
// @route   DELETE /api/hero-video
// @access  Private (Admin)
export const deleteHeroVideo = async (req, res) => {
    try {
        await HeroVideo.deleteMany({});
        res.status(200).json({
            success: true,
            message: 'Vidéo hero supprimée avec succès'
        });
    }
    catch (error) {
        console.error('Delete hero video error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la vidéo hero'
        });
    }
};
//# sourceMappingURL=heroVideo.js.map