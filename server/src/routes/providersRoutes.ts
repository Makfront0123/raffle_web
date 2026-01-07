
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { ProviderController } from '../controllers/providersController';
import { ProviderService } from '../services/providerService';

const router = express.Router();
const providersService = new ProviderService();
const providersController = new ProviderController(providersService);

router.get('/', authMiddleware, adminMiddleware, providersController.getAll);
router.post('/', authMiddleware, adminMiddleware, providersController.create);
router.get('/:id', authMiddleware, adminMiddleware, providersController.getById);
router.put('/:id', authMiddleware, adminMiddleware, providersController.update);
router.delete('/:id', authMiddleware, adminMiddleware, providersController.delete);


export default router;