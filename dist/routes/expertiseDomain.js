import express from 'express';
import { getAllExpertiseDomains, getExpertiseDomainById, createExpertiseDomain, updateExpertiseDomain, deleteExpertiseDomain } from '../controllers/expertiseDomain.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
// Public routes
router.get('/', getAllExpertiseDomains);
router.get('/:id', getExpertiseDomainById);
// Protected routes (Admin only)
router.post('/', authenticateToken, createExpertiseDomain);
router.put('/:id', authenticateToken, updateExpertiseDomain);
router.delete('/:id', authenticateToken, deleteExpertiseDomain);
export default router;
//# sourceMappingURL=expertiseDomain.js.map