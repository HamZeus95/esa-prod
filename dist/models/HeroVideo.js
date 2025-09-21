import mongoose, { Schema } from 'mongoose';
const heroVideoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: false,
        maxlength: 500
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: false
    },
    duration: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Ensure only one hero video exists (singleton pattern)
heroVideoSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Delete any existing hero video before creating a new one
        await mongoose.model('HeroVideo').deleteMany({});
    }
    next();
});
export const HeroVideo = mongoose.model('HeroVideo', heroVideoSchema);
//# sourceMappingURL=HeroVideo.js.map