import mongoose, { Schema } from 'mongoose';
const serviceImageSchema = new Schema({
    id: {
        type: String,
        required: false // Make id optional since MongoDB will provide _id
    },
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
    altText: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    }
}, { _id: false });
const serviceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    detailedDescription: {
        type: String,
        required: true,
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Structural Design',
            'Dynamic Structures',
            'Execution Plans',
            'Manufacturing Plans',
            'Project Management',
            'Technical Solutions'
        ]
    },
    features: [{
            type: String,
            trim: true,
            maxlength: 200
        }],
    images: [serviceImageSchema], // Added images support
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Index for better query performance
serviceSchema.index({ category: 1, order: 1 });
serviceSchema.index({ active: 1, order: 1 });
export const Service = mongoose.model('Service', serviceSchema);
//# sourceMappingURL=Service.js.map