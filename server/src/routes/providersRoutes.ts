
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { ProviderController } from '../controllers/providersController';
import { ProviderService } from '../services/providerService';
import { adminMiddlewareLimited } from '../middleware/adminMiddlewareLimited';
import { adminLimiter } from '../middleware/limitRequest';
import { validate } from '../middleware/validate';
import { createProviderSchema, updateProviderSchema } from '../schema/provider.schema';
import { idSchema } from '../schema/common.schema';
const router = express.Router();
const providersService = new ProviderService();
const providersController = new ProviderController(providersService);

router.get('/', authMiddleware, adminMiddleware, providersController.getAll);
router.post('/', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ body: createProviderSchema }), providersController.create);
router.get('/:id', authMiddleware, adminLimiter, adminMiddleware, validate({ params: idSchema }), providersController.getById);
router.put('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({params: idSchema,body: updateProviderSchema}), providersController.update);
router.delete('/:id', authMiddleware, adminLimiter, adminMiddleware, adminMiddlewareLimited, validate({ params: idSchema }), providersController.delete);


export default router;