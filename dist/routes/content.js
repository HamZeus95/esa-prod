"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const content_1 = require("../controllers/content");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/content
// @access  Private (Admin)
router.get('/', auth_1.authenticateToken, auth_1.requireAdmin, content_1.getAllContent);
// @route   GET /api/content/:type
// @access  Public
router.get('/:type', content_1.getContentByType);
// @route   PUT /api/content/:type
// @access  Private (Admin)
router.put('/:type', auth_1.authenticateToken, auth_1.requireAdmin, content_1.updateContentByType);
exports.default = router;
//# sourceMappingURL=content.js.map