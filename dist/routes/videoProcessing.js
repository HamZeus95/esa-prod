"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const auth_1 = require("../middleware/auth");
const videoProcessor_1 = __importDefault(require("../utils/videoProcessor"));
const HeroVideo_1 = require("../models/HeroVideo");
const router = (0, express_1.Router)();
// Configure multer for video uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(process.cwd(), 'uploads', 'temp');
        // Create directory if it doesn't exist
        promises_1.default.mkdir(uploadPath, { recursive: true }).then(() => {
            cb(null, uploadPath);
        }).catch(err => cb(err, uploadPath));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `video-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 200 * 1024 * 1024, // 200MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is a video
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only video files are allowed!'));
        }
    }
});
// POST /api/video-processing/hero - Upload and process hero video
router.post('/hero', auth_1.authenticateToken, auth_1.requirePasswordChange, auth_1.requireAdmin, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided'
            });
        }
        const { title, description } = req.body;
        if (!title) {
            // Clean up uploaded file
            await promises_1.default.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }
        // Process the video
        const outputDir = path_1.default.join(process.cwd(), 'uploads');
        const processedVideo = await videoProcessor_1.default.processVideo({
            inputPath: req.file.path,
            outputDir,
            filename: req.file.filename,
            quality: 'medium',
            generateThumbnail: true,
            formats: ['mp4', 'webm']
        });
        // Create or update hero video record
        const heroVideoData = {
            title,
            description: description || '',
            videoUrl: processedVideo.mp4,
            videoUrlWebm: processedVideo.webm,
            thumbnailUrl: processedVideo.thumbnail || '',
            duration: processedVideo.duration,
            fileSize: processedVideo.size,
            isActive: true
        };
        // Delete existing hero video files
        const existingHeroVideo = await HeroVideo_1.HeroVideo.findOne();
        if (existingHeroVideo) {
            const filesToCleanup = [
                existingHeroVideo.videoUrl,
                existingHeroVideo.videoUrlWebm,
                existingHeroVideo.thumbnailUrl
            ].filter(Boolean).map(url => path_1.default.join(process.cwd(), url.replace('/uploads/', 'uploads/')));
            await videoProcessor_1.default.cleanupFiles(filesToCleanup);
        }
        // Save new hero video
        const heroVideo = new HeroVideo_1.HeroVideo(heroVideoData);
        await heroVideo.save();
        res.status(200).json({
            success: true,
            data: heroVideo,
            message: 'Hero video processed and saved successfully'
        });
    }
    catch (error) {
        console.error('Video processing error:', error);
        // Clean up uploaded file on error
        if (req.file) {
            try {
                await promises_1.default.unlink(req.file.path);
            }
            catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process video'
        });
    }
});
// GET /api/video-processing/status/:taskId - Get processing status (for future use)
router.get('/status/:taskId', auth_1.authenticateToken, auth_1.requirePasswordChange, auth_1.requireAdmin, (req, res) => {
    // Placeholder for future implementation of async processing status
    res.status(200).json({
        success: true,
        data: {
            status: 'completed',
            progress: 100
        }
    });
});
exports.default = router;
//# sourceMappingURL=videoProcessing.js.map