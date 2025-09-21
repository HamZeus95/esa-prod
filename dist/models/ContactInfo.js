import mongoose, { Schema } from 'mongoose';
// Email Contact Schema
const EmailContactSchema = new Schema({
    label: { type: String, required: true },
    email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Phone Contact Schema
const PhoneContactSchema = new Schema({
    label: { type: String, required: true },
    phone: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Location Contact Schema
const LocationContactSchema = new Schema({
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
const BusinessHoursSchema = new Schema({
    label: { type: String, required: true },
    schedule: { type: String, required: true },
    timezone: { type: String, default: 'Europe/Paris' },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Social Media Schema
const SocialMediaSchema = new Schema({
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
const WhatsAppContactSchema = new Schema({
    label: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: 'Bonjour, je souhaite obtenir des informations.' },
    isVisible: { type: Boolean, default: true }
}, {
    timestamps: true
});
// Export Models
export const EmailContact = mongoose.model('EmailContact', EmailContactSchema);
export const PhoneContact = mongoose.model('PhoneContact', PhoneContactSchema);
export const LocationContact = mongoose.model('LocationContact', LocationContactSchema);
export const BusinessHours = mongoose.model('BusinessHours', BusinessHoursSchema);
export const SocialMedia = mongoose.model('SocialMedia', SocialMediaSchema);
export const WhatsAppContact = mongoose.model('WhatsAppContact', WhatsAppContactSchema);
//# sourceMappingURL=ContactInfo.js.map