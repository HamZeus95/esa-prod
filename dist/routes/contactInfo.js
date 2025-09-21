import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
// Combined API for public
getAllContactInfo, 
// Email contacts
getEmailContacts, createEmailContact, updateEmailContact, deleteEmailContact, 
// Phone contacts
getPhoneContacts, createPhoneContact, updatePhoneContact, deletePhoneContact, 
// Location contacts  
getLocationContacts, createLocationContact, updateLocationContact, deleteLocationContact, 
// Business hours
getBusinessHours, createBusinessHours, updateBusinessHours, deleteBusinessHours, 
// Social media
getSocialMedia, createSocialMedia, updateSocialMedia, deleteSocialMedia, 
// WhatsApp contact
getWhatsAppContact, createOrUpdateWhatsAppContact, deleteWhatsAppContact } from '../controllers/contactInfo.js';
const router = express.Router();
// Public route for all contact info
router.get('/all', getAllContactInfo);
// Email Contacts Routes
router.get('/emails', getEmailContacts);
router.post('/emails', authenticateToken, createEmailContact);
router.put('/emails/:id', authenticateToken, updateEmailContact);
router.delete('/emails/:id', authenticateToken, deleteEmailContact);
// Phone Contacts Routes
router.get('/phones', getPhoneContacts);
router.post('/phones', authenticateToken, createPhoneContact);
router.put('/phones/:id', authenticateToken, updatePhoneContact);
router.delete('/phones/:id', authenticateToken, deletePhoneContact);
// Location Contacts Routes
router.get('/locations', getLocationContacts);
router.post('/locations', authenticateToken, createLocationContact);
router.put('/locations/:id', authenticateToken, updateLocationContact);
router.delete('/locations/:id', authenticateToken, deleteLocationContact);
// Business Hours Routes
router.get('/hours', getBusinessHours);
router.post('/hours', authenticateToken, createBusinessHours);
router.put('/hours/:id', authenticateToken, updateBusinessHours);
router.delete('/hours/:id', authenticateToken, deleteBusinessHours);
// Social Media Routes
router.get('/social', getSocialMedia);
router.post('/social', authenticateToken, createSocialMedia);
router.put('/social/:id', authenticateToken, updateSocialMedia);
router.delete('/social/:id', authenticateToken, deleteSocialMedia);
// WhatsApp Contact Routes (Singleton)
router.get('/whatsapp', getWhatsAppContact);
router.post('/whatsapp', authenticateToken, createOrUpdateWhatsAppContact);
router.put('/whatsapp', authenticateToken, createOrUpdateWhatsAppContact);
router.delete('/whatsapp', authenticateToken, deleteWhatsAppContact);
export default router;
//# sourceMappingURL=contactInfo.js.map