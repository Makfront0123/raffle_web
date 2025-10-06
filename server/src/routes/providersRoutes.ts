
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { ProviderController } from '../controllers/providersController';

const router = express.Router();
const providersController = new ProviderController();

router.get('/', authMiddleware, adminMiddleware, providersController.getAll);
router.post('/', authMiddleware, adminMiddleware, providersController.create);
router.get('/:id', authMiddleware, providersController.getById);
router.delete('/:id', authMiddleware, adminMiddleware, providersController.delete);


export default router;