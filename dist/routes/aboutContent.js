"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aboutContent_1 = require("../controllers/aboutContent");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/about-content - Get about content (public)
router.get('/', aboutContent_1.getAboutContent);
// POST /api/about-content - Create or update about content (admin only)  
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, aboutContent_1.createOrUpdateAboutContent);
// DELETE /api/about-content - Delete about content (admin only)
router.delete('/', auth_1.authenticateToken, auth_1.requireAdmin, aboutContent_1.deleteAboutContent);
exports.default = router;
//# sourceMappingURL=aboutContent.js.map