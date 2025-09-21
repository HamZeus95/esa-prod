import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        }
        catch (error) {
            cb(error, '');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi,mov,webm').split(',');
    const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowedTypes.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '262144000') // 250MB default
    }
});
// Simple upload handler (replaces MediaFile system)
export const simpleUpload = async (req, res) => {
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
// Legacy functions - all disabled since MediaFile system was removed
export const uploadFiles = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Legacy upload method disabled. Use simple upload.'
    });
};
export const getMediaFiles = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
export const getMediaFile = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
export const updateMediaFile = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
export const deleteMediaFile = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
export const getMediaStats = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'MediaFile system disabled'
    });
};
//# sourceMappingURL=media.js.map