
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { UserController } from '../controllers/userController';
import { idSchema } from '../schema/common.schema';
import { validate } from '../middleware/validate';

const router = express.Router();
const userController = new UserController();

router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, validate({ params: idSchema }), userController.getUserById);
router.put('/:id', authMiddleware, adminMiddleware, validate({ params: idSchema }), userController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, validate({ params: idSchema }), userController.deleteUser);

export default router;