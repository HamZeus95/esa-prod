"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("../controllers/service");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/', service_1.getAllServices);
router.get('/categories', service_1.getServiceCategories);
router.get('/:id', service_1.getServiceById);
// Protected routes (Admin only)
router.post('/', auth_1.authenticateToken, service_1.createService);
router.put('/:id', auth_1.authenticateToken, service_1.updateService);
router.delete('/:id', auth_1.authenticateToken, service_1.deleteService);
exports.default = router;
//# sourceMappingURL=service.js.map