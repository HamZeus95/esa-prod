import mongoose, { Schema } from 'mongoose';
const expertiseDomainSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    icon: {
        type: String,
        required: false, // Made optional since we can have image instead
        trim: true
    },
    iconType: {
        type: String,
        enum: ['icon', 'image'],
        default: 'image'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Index for better query performance
expertiseDomainSchema.index({ order: 1, isActive: 1 });
export const ExpertiseDomain = mongoose.model('ExpertiseDomain', expertiseDomainSchema);
//# sourceMappingURL=ExpertiseDomain.js.map