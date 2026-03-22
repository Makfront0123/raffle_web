
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { ProviderController } from '../controllers/providersController';
import { ProviderService } from '../services/providerService';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';
import { adminLimiter } from '../middleware/limitRequest';
const router = express.Router();
const providersService = new ProviderService();
const providersController = new ProviderController(providersService);

router.get('/', authMiddleware, adminMiddleware, providersController.getAll);
router.post('/', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, providersController.create);
router.get('/:id', authMiddleware, adminLimiter, adminMiddleware, providersController.getById);
router.put('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, providersController.update);
router.delete('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, providersController.delete);


export default router;