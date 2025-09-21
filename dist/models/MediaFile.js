import mongoose, { Schema } from 'mongoose';
const mediaFileSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: 'general'
    },
    altText: {
        type: String,
        default: ''
    },
    uploadedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
export const MediaFile = mongoose.model('MediaFile', mediaFileSchema);
//# sourceMappingURL=MediaFile.js.map