"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWhatsAppContact = exports.createOrUpdateWhatsAppContact = exports.getWhatsAppContact = exports.deleteSocialMedia = exports.updateSocialMedia = exports.createSocialMedia = exports.getSocialMedia = exports.deleteBusinessHours = exports.updateBusinessHours = exports.createBusinessHours = exports.getBusinessHours = exports.deleteLocationContact = exports.updateLocationContact = exports.createLocationContact = exports.getLocationContacts = exports.deletePhoneContact = exports.updatePhoneContact = exports.createPhoneContact = exports.getPhoneContacts = exports.deleteEmailContact = exports.updateEmailContact = exports.createEmailContact = exports.getEmailContacts = exports.getAllContactInfo = void 0;
const ContactInfo_1 = require("../models/ContactInfo");
// Combined ContactInfo API for public access
const getAllContactInfo = async (req, res) => {
    try {
        const [emails, phones, locations, hours, social, whatsapp] = await Promise.all([
            ContactInfo_1.EmailContact.find({ isVisible: true }).sort({ order: 1 }),
            ContactInfo_1.PhoneContact.find({ isVisible: true }).sort({ order: 1 }),
            ContactInfo_1.LocationContact.find({ isVisible: true }).sort({ order: 1 }),
            ContactInfo_1.BusinessHours.find({ isVisible: true }).sort({ order: 1 }),
            ContactInfo_1.SocialMedia.find({ isVisible: true }).sort({ order: 1 }),
            ContactInfo_1.WhatsAppContact.findOne({ isVisible: true })
        ]);
        res.json({
            success: true,
            data: {
                emails,
                phones,
                locations,
                hours,
                social,
                whatsapp
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des informations de contact',
            error: error.message
        });
    }
};
exports.getAllContactInfo = getAllContactInfo;
// Email Contacts Controllers
const getEmailContacts = async (req, res) => {
    try {
        const emails = await ContactInfo_1.EmailContact.find().sort({ order: 1 });
        res.json({
            success: true,
            data: emails
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des emails',
            error: error.message
        });
    }
};
exports.getEmailContacts = getEmailContacts;
const createEmailContact = async (req, res) => {
    try {
        const { label, email, isVisible = true, order = 0 } = req.body;
        if (!label || !email) {
            return res.status(400).json({
                success: false,
                message: 'Le label et l\'email sont requis'
            });
        }
        const emailContact = new ContactInfo_1.EmailContact({
            label,
            email,
            isVisible,
            order
        });
        const savedEmail = await emailContact.save();
        res.status(201).json({
            success: true,
            data: savedEmail
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'email',
            error: error.message
        });
    }
};
exports.createEmailContact = createEmailContact;
const updateEmailContact = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedEmail = await ContactInfo_1.EmailContact.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedEmail) {
            return res.status(404).json({
                success: false,
                message: 'Email non trouvé'
            });
        }
        res.json({
            success: true,
            data: updatedEmail
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'email',
            error: error.message
        });
    }
};
exports.updateEmailContact = updateEmailContact;
const deleteEmailContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmail = await ContactInfo_1.EmailContact.findByIdAndDelete(id);
        if (!deletedEmail) {
            return res.status(404).json({
                success: false,
                message: 'Email non trouvé'
            });
        }
        res.json({
            success: true,
            message: 'Email supprimé avec succès'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'email',
            error: error.message
        });
    }
};
exports.deleteEmailContact = deleteEmailContact;
// Phone Contacts Controllers
const getPhoneContacts = async (req, res) => {
    try {
        const phones = await ContactInfo_1.PhoneContact.find().sort({ order: 1 });
        res.json({
            success: true,
            data: phones
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des téléphones',
            error: error.message
        });
    }
};
exports.getPhoneContacts = getPhoneContacts;
const createPhoneContact = async (req, res) => {
    try {
        const { label, phone, isVisible = true, order = 0 } = req.body;
        if (!label || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Le label et le téléphone sont requis'
            });
        }
        const phoneContact = new ContactInfo_1.PhoneContact({
            label,
            phone,
            isVisible,
            order
        });
        const savedPhone = await phoneContact.save();
        res.status(201).json({
            success: true,
            data: savedPhone
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du téléphone',
            error: error.message
        });
    }
};
exports.createPhoneContact = createPhoneContact;
const updatePhoneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedPhone = await ContactInfo_1.PhoneContact.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedPhone) {
            return res.status(404).json({
                success: false,
                message: 'Téléphone non trouvé'
            });
        }
        res.json({
            success: true,
            data: updatedPhone
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du téléphone',
            error: error.message
        });
    }
};
exports.updatePhoneContact = updatePhoneContact;
const deletePhoneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPhone = await ContactInfo_1.PhoneContact.findByIdAndDelete(id);
        if (!deletedPhone) {
            return res.status(404).json({
                success: false,
                message: 'Téléphone non trouvé'
            });
        }
        res.json({
            success: true,
            message: 'Téléphone supprimé avec succès'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du téléphone',
            error: error.message
        });
    }
};
exports.deletePhoneContact = deletePhoneContact;
// Location Contacts Controllers
const getLocationContacts = async (req, res) => {
    try {
        const locations = await ContactInfo_1.LocationContact.find().sort({ order: 1 });
        res.json({
            success: true,
            data: locations
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des adresses',
            error: error.message
        });
    }
};
exports.getLocationContacts = getLocationContacts;
const createLocationContact = async (req, res) => {
    try {
        const { label, address, coordinates, isVisible = true, order = 0 } = req.body;
        if (!label || !address) {
            return res.status(400).json({
                success: false,
                message: 'Le label et l\'adresse sont requis'
            });
        }
        const locationContact = new ContactInfo_1.LocationContact({
            label,
            address,
            coordinates,
            isVisible,
            order
        });
        const savedLocation = await locationContact.save();
        res.status(201).json({
            success: true,
            data: savedLocation
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'adresse',
            error: error.message
        });
    }
};
exports.createLocationContact = createLocationContact;
const updateLocationContact = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedLocation = await ContactInfo_1.LocationContact.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedLocation) {
            return res.status(404).json({
                success: false,
                message: 'Adresse non trouvée'
            });
        }
        res.json({
            success: true,
            data: updatedLocation
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'adresse',
            error: error.message
        });
    }
};
exports.updateLocationContact = updateLocationContact;
const deleteLocationContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLocation = await ContactInfo_1.LocationContact.findByIdAndDelete(id);
        if (!deletedLocation) {
            return res.status(404).json({
                success: false,
                message: 'Adresse non trouvée'
            });
        }
        res.json({
            success: true,
            message: 'Adresse supprimée avec succès'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'adresse',
            error: error.message
        });
    }
};
exports.deleteLocationContact = deleteLocationContact;
// Business Hours Controllers
const getBusinessHours = async (req, res) => {
    try {
        const hours = await ContactInfo_1.BusinessHours.find().sort({ order: 1 });
        res.json({
            success: true,
            data: hours
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des horaires',
            error: error.message
        });
    }
};
exports.getBusinessHours = getBusinessHours;
const createBusinessHours = async (req, res) => {
    try {
        const { label, schedule, timezone = 'Europe/Paris', isVisible = true, order = 0 } = req.body;
        if (!label || !schedule) {
            return res.status(400).json({
                success: false,
                message: 'Le label et les horaires sont requis'
            });
        }
        const businessHours = new ContactInfo_1.BusinessHours({
            label,
            schedule,
            timezone,
            isVisible,
            order
        });
        const savedHours = await businessHours.save();
        res.status(201).json({
            success: true,
            data: savedHours
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création des horaires',
            error: error.message
        });
    }
};
exports.createBusinessHours = createBusinessHours;
const updateBusinessHours = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedHours = await ContactInfo_1.BusinessHours.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedHours) {
            return res.status(404).json({
                success: false,
                message: 'Horaires non trouvés'
            });
        }
        res.json({
            success: true,
            data: updatedHours
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des horaires',
            error: error.message
        });
    }
};
exports.updateBusinessHours = updateBusinessHours;
const deleteBusinessHours = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHours = await ContactInfo_1.BusinessHours.findByIdAndDelete(id);
        if (!deletedHours) {
            return res.status(404).json({
                success: false,
                message: 'Horaires non trouvés'
            });
        }
        res.json({
            success: true,
            message: 'Horaires supprimés avec succès'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression des horaires',
            error: error.message
        });
    }
};
exports.deleteBusinessHours = deleteBusinessHours;
// Social Media Controllers
const getSocialMedia = async (req, res) => {
    try {
        const social = await ContactInfo_1.SocialMedia.find().sort({ order: 1 });
        res.json({
            success: true,
            data: social
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réseaux sociaux',
            error: error.message
        });
    }
};
exports.getSocialMedia = getSocialMedia;
const createSocialMedia = async (req, res) => {
    try {
        const { platform, label, url, icon, isVisible = true, order = 0 } = req.body;
        if (!platform || !label || !url) {
            return res.status(400).json({
                success: false,
                message: 'La plateforme, le label et l\'URL sont requis'
            });
        }
        const socialMedia = new ContactInfo_1.SocialMedia({
            platform,
            label,
            url,
            icon,
            isVisible,
            order
        });
        const savedSocial = await socialMedia.save();
        res.status(201).json({
            success: true,
            data: savedSocial
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du réseau social',
            error: error.message
        });
    }
};
exports.createSocialMedia = createSocialMedia;
const updateSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedSocial = await ContactInfo_1.SocialMedia.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedSocial) {
            return res.status(404).json({
                success: false,
                message: 'Réseau social non trouvé'
            });
        }
        res.json({
            success: true,
            data: updatedSocial
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du réseau social',
            error: error.message
        });
    }
};
exports.updateSocialMedia = updateSocialMedia;
const deleteSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSocial = await ContactInfo_1.SocialMedia.findByIdAndDelete(id);
        if (!deletedSocial) {
            return res.status(404).json({
                success: false,
                message: 'Réseau social non trouvé'
            });
        }
        res.json({
            success: true,
            message: 'Réseau social supprimé avec succès'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du réseau social',
            error: error.message
        });
    }
};
exports.deleteSocialMedia = deleteSocialMedia;
// WhatsApp Contact Controllers (Singleton)
const getWhatsAppContact = async (req, res) => {
    try {
        const whatsapp = await ContactInfo_1.WhatsAppContact.findOne();
        res.json({
            success: true,
            data: whatsapp
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du contact WhatsApp',
            error: error.message
        });
    }
};
exports.getWhatsAppContact = getWhatsAppContact;
const createOrUpdateWhatsAppContact = async (req, res) => {
    try {
        const { label, phone, message, isVisible = true } = req.body;
        if (!label || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Le label et le téléphone sont requis'
            });
        }
        // Check if WhatsApp contact already exists (singleton)
        const existingWhatsApp = await ContactInfo_1.WhatsAppContact.findOne();
        let whatsappContact;
        if (existingWhatsApp) {
            // Update existing
            whatsappContact = await ContactInfo_1.WhatsAppContact.findByIdAndUpdate(existingWhatsApp._id, { label, phone, message, isVisible }, { new: true, runValidators: true });
        }
        else {
            // Create new
            whatsappContact = new ContactInfo_1.WhatsAppContact({
                label,
                phone,
                message,
                isVisible
            });
            whatsappContact = await whatsappContact.save();
        }
        res.json({
            success: true,
            data: whatsappContact
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la sauvegarde du contact WhatsApp',
            error: error.message
        });
    }
};
exports.createOrUpdateWhatsAppContact = createOrUpdateWhatsAppContact;
const deleteWhatsAppContact = async (req, res) => {
    try {
        const deletedWhatsApp = await ContactInfo_1.WhatsAppContact.findOneAndDelete();
        if (!deletedWhatsApp) {
            return res.status(404).json({
                success: false,
                message: 'Contact WhatsApp non trouvé'
            });
        }
        res.json({
            success: true,
            message: 'Contact WhatsApp supprimé avec succès'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du contact WhatsApp',
            error: error.message
        });
    }
};
exports.deleteWhatsAppContact = deleteWhatsAppContact;
//# sourceMappingURL=contactInfo.js.map