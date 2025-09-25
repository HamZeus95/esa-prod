"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expertiseDomain_1 = require("../controllers/expertiseDomain");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/', expertiseDomain_1.getAllExpertiseDomains);
router.get('/:id', expertiseDomain_1.getExpertiseDomainById);
// Protected routes (Admin only)
router.post('/', auth_1.authenticateToken, expertiseDomain_1.createExpertiseDomain);
router.put('/:id', auth_1.authenticateToken, expertiseDomain_1.updateExpertiseDomain);
router.delete('/:id', auth_1.authenticateToken, expertiseDomain_1.deleteExpertiseDomain);
exports.default = router;
//# sourceMappingURL=expertiseDomain.js.map