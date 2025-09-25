"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaStats = exports.deleteMediaFile = exports.updateMediaFile = exports.getMediaFile = exports.getMediaFiles = exports.uploadFiles = exports.simpleUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../uploads');
        try {
            await promises_1.default.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        }
        catch (error) {
            cb(error, '');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi,mov,webm').split(',');
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase().slice(1);
    if (allowedTypes.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '262144000') // 250MB default
    }
});
// Simple upload handler (replaces MediaFile system)
const simpleUpload = async (req, res) => {
    try {
        if (!req.file) {
            console.log('❌ No file uploaded');
            res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
            return;
        }
        const file = req.file;
        ;
        const fileUrl = `/uploads/${file.filename}`;
        console.log('✅ File uploaded successfully:', fileUrl);
        res.status(200).json({
            success: true,
            data: {
                filename: file.filename,
                originalName: file.originalname,
                url: fileUrl,
                size: file.size,
                mimeType: file.mimetype
            },
            message: 'File uploaded successfully'
        });
    }
    catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file'
        });
    }
};
exports.simpleUpload = simpleUpload;
// Legacy functions - all disabled since MediaFile system was removed
const uploadFiles = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Legacy upload method disabled. Use simple upload.'
    });
};
exports.uploadFiles = uploadFiles;
const getMediaFiles = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
exports.getMediaFiles = getMediaFiles;
const getMediaFile = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
exports.getMediaFile = getMediaFile;
const updateMediaFile = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
exports.updateMediaFile = updateMediaFile;
const deleteMediaFile = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
exports.deleteMediaFile = deleteMediaFile;
const getMediaStats = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
exports.getMediaStats = getMediaStats;
//# sourceMappingURL=media.js.map