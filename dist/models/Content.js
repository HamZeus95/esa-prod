"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = exports.AboutPage = exports.HomePage = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// HomePage Schema
const homePageSchema = new mongoose_1.Schema({
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
const teamMemberSchema = new mongoose_1.Schema({
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
const aboutPageSchema = new mongoose_1.Schema({
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
const siteSettingsSchema = new mongoose_1.Schema({
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
exports.HomePage = mongoose_1.default.model('HomePage', homePageSchema);
exports.AboutPage = mongoose_1.default.model('AboutPage', aboutPageSchema);
exports.SiteSettings = mongoose_1.default.model('SiteSettings', siteSettingsSchema);
//# sourceMappingURL=Content.js.map