"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const content_1 = require("../controllers/content");
const router = express_1.default.Router();
// Public routes - for frontend display
router.get('/:type', content_1.getContentByType);
// Protected routes - for admin management
router.put('/:type', auth_1.authenticateToken, auth_1.requireAdmin, content_1.updateContentByType);
exports.default = router;
//# sourceMappingURL=cms.js.map