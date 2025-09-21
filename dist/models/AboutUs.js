import mongoose, { Schema } from 'mongoose';
// About Us Schema
const aboutUsSchema = new Schema({
    whoAreWeHtml: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Pre-save hook to ensure only one AboutUs entry exists (singleton pattern)
aboutUsSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Delete any existing AboutUs entries before creating new one
        await mongoose.model('AboutUs').deleteMany({});
    }
    next();
});
export const AboutUs = mongoose.model('AboutUs', aboutUsSchema);
//# sourceMappingURL=AboutUs.js.map