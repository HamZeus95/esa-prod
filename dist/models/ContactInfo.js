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
exports.WhatsAppContact = exports.SocialMedia = exports.BusinessHours = exports.LocationContact = exports.PhoneContact = exports.EmailContact = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Email Contact Schema
const EmailContactSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Phone Contact Schema
const PhoneContactSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    phone: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Location Contact Schema
const LocationContactSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Business Hours Schema
const BusinessHoursSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    schedule: { type: String, required: true },
    timezone: { type: String, default: 'Europe/Paris' },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Social Media Schema
const SocialMediaSchema = new mongoose_1.Schema({
    platform: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true, match: /^https?:\/\/.+/ },
    icon: { type: String },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// WhatsApp Contact Schema (Singleton)
const WhatsAppContactSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: 'Bonjour, je souhaite obtenir des informations.' },
    isVisible: { type: Boolean, default: true }
}, {
    timestamps: true
});
// Export Models
exports.EmailContact = mongoose_1.default.model('EmailContact', EmailContactSchema);
exports.PhoneContact = mongoose_1.default.model('PhoneContact', PhoneContactSchema);
exports.LocationContact = mongoose_1.default.model('LocationContact', LocationContactSchema);
exports.BusinessHours = mongoose_1.default.model('BusinessHours', BusinessHoursSchema);
exports.SocialMedia = mongoose_1.default.model('SocialMedia', SocialMediaSchema);
exports.WhatsAppContact = mongoose_1.default.model('WhatsAppContact', WhatsAppContactSchema);
//# sourceMappingURL=ContactInfo.js.map