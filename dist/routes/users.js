import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, resetUserPassword } from '../controllers/users.js';
import { requireAdmin } from '../middleware/auth.js';
const router = Router();
// All routes require admin authentication (handled by index.ts middleware chain)
// GET /api/users - Get all users with pagination
router.get('/', requireAdmin, getUsers);
// GET /api/users/:id - Get user by ID
router.get('/:id', requireAdmin, getUserById);
// POST /api/users - Create new user
router.post('/', requireAdmin, createUser);
// PUT /api/users/:id - Update user
router.put('/:id', requireAdmin, updateUser);
// DELETE /api/users/:id - Delete user
router.delete('/:id', requireAdmin, deleteUser);
// POST /api/users/:id/reset-password - Reset user password
router.post('/:id/reset-password', requireAdmin, resetUserPassword);
export default router;
//# sourceMappingURL=users.js.map