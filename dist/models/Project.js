import mongoose, { Schema } from 'mongoose';
const projectImageSchema = new Schema({
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
const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    year: {
        type: Number,
        required: true,
        min: 1950,
        max: new Date().getFullYear() + 10
    },
    surface: {
        type: String,
        required: true,
        trim: true
    },
    usage: {
        type: String,
        required: true
    },
    structureType: {
        type: String,
        required: true,
        enum: [
            'Structure Acier',
            'Coverture',
            'Pont Roulant',
            'Mezzanine',
            'Autre'
        ]
    },
    technicalSolutions: [{
            type: String,
            trim: true
        }],
    images: [projectImageSchema],
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'archived'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    isHomePage: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Index for better query performance
projectSchema.index({ status: 1, featured: 1 });
projectSchema.index({ status: 1, isHomePage: 1 });
projectSchema.index({ year: -1 });
projectSchema.index({ title: 'text', description: 'text' });
// Virtual for project URL
projectSchema.virtual('url').get(function () {
    return `/projects/${this._id}`;
});
// Pre-save hook to limit featured projects
projectSchema.pre('save', async function (next) {
    const project = this; // Type assertion to access properties
    if (project.isModified('featured') && project.featured) {
        // Limit to maximum 6 featured projects
        const featuredCount = await mongoose.model('Project').countDocuments({
            featured: true,
            _id: { $ne: project._id }
        });
        if (featuredCount >= 6) {
            const error = new Error('Maximum 6 projects can be featured at a time');
            return next(error);
        }
    }
    next();
});
projectSchema.pre('save', async function (next) {
    const project = this; // Type assertion to access properties
    if (project.isModified('isHomePage') && project.isHomePage) {
        // limit to maximum 4 home page project
        const homePageCount = await mongoose.model('Project').countDocuments({
            isHomePage: true,
            _id: { $ne: project._id }
        });
        if (homePageCount >= 4) {
            const error = new Error("Maximum 4 projets peuvent être affichés sur la page d'accueil.");
            return next(error);
        }
    }
    next();
});
export const Project = mongoose.model('Project', projectSchema);
//# sourceMappingURL=Project.js.map