import mongoose, { Schema } from 'mongoose';
// HomePage Schema
const homePageSchema = new Schema({
    heroTitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    heroSubtitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    heroDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    ctaButton1Text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    ctaButton2Text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    statistics: {
        experience: {
            type: String,
            required: true,
            trim: true
        },
        projects: {
            type: String,
            required: true,
            trim: true
        },
        compliance: {
            type: String,
            required: true,
            trim: true
        },
        software: {
            type: String,
            required: true,
            trim: true
        }
    }
}, {
    timestamps: { createdAt: false, updatedAt: true }
});
// Team Member Schema
const teamMemberSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    position: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    image: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    linkedin: {
        type: String,
        trim: true
    }
}, { _id: false });
// AboutPage Schema
const aboutPageSchema = new Schema({
    companyDescription: {
        type: String,
        required: true,
        maxlength: 2000
    },
    mission: {
        type: String,
        required: true,
        maxlength: 1000
    },
    vision: {
        type: String,
        required: true,
        maxlength: 1000
    },
    values: [{
            type: String,
            trim: true,
            maxlength: 200
        }],
    teamMembers: [teamMemberSchema]
}, {
    timestamps: { createdAt: false, updatedAt: true }
});
// Site Settings Schema
const siteSettingsSchema = new Schema({
    siteName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    siteDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true
    },
    contactAddress: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    businessHours: {
        weekdays: {
            type: String,
            required: true,
            trim: true
        },
        weekends: {
            type: String,
            required: true,
            trim: true
        }
    },
    socialMedia: {
        linkedin: {
            type: String,
            trim: true
        },
        facebook: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        }
    },
    seoSettings: {
        metaTitle: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60
        },
        metaDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160
        },
        metaKeywords: [{
                type: String,
                trim: true
            }]
    }
}, {
    timestamps: { createdAt: false, updatedAt: true }
});
export const HomePage = mongoose.model('HomePage', homePageSchema);
export const AboutPage = mongoose.model('AboutPage', aboutPageSchema);
export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
//# sourceMappingURL=Content.js.map