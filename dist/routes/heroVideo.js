"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const heroVideo_1 = require("../controllers/heroVideo");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/hero-video - Récupérer la vidéo hero (public)
router.get('/', heroVideo_1.getHeroVideo);
// POST /api/hero-video - Créer ou mettre à jour la vidéo hero (admin uniquement)
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, heroVideo_1.createOrUpdateHeroVideo);
// DELETE /api/hero-video - Supprimer la vidéo hero (admin uniquement)
router.delete('/', auth_1.authenticateToken, auth_1.requireAdmin, heroVideo_1.deleteHeroVideo);
exports.default = router;
//# sourceMappingURL=heroVideo.js.map