"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const contactInfo_1 = require("../controllers/contactInfo");
const router = express_1.default.Router();
// Public route for all contact info
router.get('/all', contactInfo_1.getAllContactInfo);
// Email Contacts Routes
router.get('/emails', contactInfo_1.getEmailContacts);
router.post('/emails', auth_1.authenticateToken, contactInfo_1.createEmailContact);
router.put('/emails/:id', auth_1.authenticateToken, contactInfo_1.updateEmailContact);
router.delete('/emails/:id', auth_1.authenticateToken, contactInfo_1.deleteEmailContact);
// Phone Contacts Routes
router.get('/phones', contactInfo_1.getPhoneContacts);
router.post('/phones', auth_1.authenticateToken, contactInfo_1.createPhoneContact);
router.put('/phones/:id', auth_1.authenticateToken, contactInfo_1.updatePhoneContact);
router.delete('/phones/:id', auth_1.authenticateToken, contactInfo_1.deletePhoneContact);
// Location Contacts Routes
router.get('/locations', contactInfo_1.getLocationContacts);
router.post('/locations', auth_1.authenticateToken, contactInfo_1.createLocationContact);
router.put('/locations/:id', auth_1.authenticateToken, contactInfo_1.updateLocationContact);
router.delete('/locations/:id', auth_1.authenticateToken, contactInfo_1.deleteLocationContact);
// Business Hours Routes
router.get('/hours', contactInfo_1.getBusinessHours);
router.post('/hours', auth_1.authenticateToken, contactInfo_1.createBusinessHours);
router.put('/hours/:id', auth_1.authenticateToken, contactInfo_1.updateBusinessHours);
router.delete('/hours/:id', auth_1.authenticateToken, contactInfo_1.deleteBusinessHours);
// Social Media Routes
router.get('/social', contactInfo_1.getSocialMedia);
router.post('/social', auth_1.authenticateToken, contactInfo_1.createSocialMedia);
router.put('/social/:id', auth_1.authenticateToken, contactInfo_1.updateSocialMedia);
router.delete('/social/:id', auth_1.authenticateToken, contactInfo_1.deleteSocialMedia);
// WhatsApp Contact Routes (Singleton)
router.get('/whatsapp', contactInfo_1.getWhatsAppContact);
router.post('/whatsapp', auth_1.authenticateToken, contactInfo_1.createOrUpdateWhatsAppContact);
router.put('/whatsapp', auth_1.authenticateToken, contactInfo_1.createOrUpdateWhatsAppContact);
router.delete('/whatsapp', auth_1.authenticateToken, contactInfo_1.deleteWhatsAppContact);
exports.default = router;
//# sourceMappingURL=contactInfo.js.map