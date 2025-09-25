"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require admin authentication (handled by index.ts middleware chain)
// GET /api/users - Get all users with pagination
router.get('/', auth_1.requireAdmin, users_1.getUsers);
// GET /api/users/:id - Get user by ID
router.get('/:id', auth_1.requireAdmin, users_1.getUserById);
// POST /api/users - Create new user
router.post('/', auth_1.requireAdmin, users_1.createUser);
// PUT /api/users/:id - Update user
router.put('/:id', auth_1.requireAdmin, users_1.updateUser);
// DELETE /api/users/:id - Delete user
router.delete('/:id', auth_1.requireAdmin, users_1.deleteUser);
// POST /api/users/:id/reset-password - Reset user password
router.post('/:id/reset-password', auth_1.requireAdmin, users_1.resetUserPassword);
exports.default = router;
//# sourceMappingURL=users.js.map