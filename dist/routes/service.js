import express from 'express';
import { getAllServices, getServiceById, createService, updateService, deleteService, getServiceCategories } from '../controllers/service.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
// Public routes
router.get('/', getAllServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getServiceById);
// Protected routes (Admin only)
router.post('/', authenticateToken, createService);
router.put('/:id', authenticateToken, updateService);
router.delete('/:id', authenticateToken, deleteService);
export default router;
//# sourceMappingURL=service.js.map