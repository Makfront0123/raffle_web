
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { ProviderController } from '../controllers/providersController';
import { ProviderService } from '../services/providerService';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';
const router = express.Router();
const providersService = new ProviderService();
const providersController = new ProviderController(providersService);

router.get('/', authMiddleware, adminMiddleware, providersController.getAll);
router.post('/', authMiddleware, adminMiddleware, adminMiddlewareLimited, providersController.create);
router.get('/:id', authMiddleware, adminMiddleware, providersController.getById);
router.put('/:id', authMiddleware, adminMiddleware,adminMiddlewareLimited, providersController.update);
router.delete('/:id', authMiddleware, adminMiddleware,adminMiddlewareLimited, providersController.delete);


export default router;