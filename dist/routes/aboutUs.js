"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aboutUs_1 = require("../controllers/aboutUs");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/about-us - Récupérer le contenu "Qui Sommes-Nous" (public)
router.get('/', aboutUs_1.getAboutUs);
// POST /api/about-us - Créer ou mettre à jour le contenu "Qui Sommes-Nous" (admin uniquement)
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, aboutUs_1.createOrUpdateAboutUs);
// DELETE /api/about-us - Supprimer le contenu "Qui Sommes-Nous" (admin uniquement)
router.delete('/', auth_1.authenticateToken, auth_1.requireAdmin, aboutUs_1.deleteAboutUs);
exports.default = router;
//# sourceMappingURL=aboutUs.js.map