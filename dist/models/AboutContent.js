import mongoose, { Schema } from 'mongoose';
const AboutContentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Le contenu est requis'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Ensure only one AboutContent document exists (singleton pattern)
AboutContentSchema.pre('save', async function (next) {
    if (this.isNew) {
        await mongoose.model('AboutContent').deleteMany({});
    }
    next();
});
export const AboutContent = mongoose.model('AboutContent', AboutContentSchema);
//# sourceMappingURL=AboutContent.js.map