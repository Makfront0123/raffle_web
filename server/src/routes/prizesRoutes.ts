import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrizesController } from '../controllers/prizesController';
import { PrizesService } from '../services/prizesService';

const router = express.Router();
const prizesService = new PrizesService();
const prizesController = new PrizesController(prizesService);

 
router.get('/', prizesController.getAllPrizes.bind(prizesController));
router.post('/', authMiddleware, adminMiddleware, prizesController.createPrize.bind(prizesController));


// ⬇⬇⬇ RUTAS SIN PARÁMETROS PRIMERO ⬇⬇⬇
router.get('/winners', prizesController.getWinners.bind(prizesController));   // ← TODOS LOS GANADORES


// ⬇⬇⬇ luego rutas con parámetros ESPECÍFICOS ⬇⬇⬇
router.get('/:raffleId/winner', prizesController.getWinner.bind(prizesController)); // ← GANADOR POR RIFA


// ⬇⬇⬇ luego rutas con parámetro libre :id ⬇⬇⬇
router.post('/:id/select-winner', prizesController.selectWinner.bind(prizesController));
router.post('/:raffleId/close-raffle', authMiddleware, adminMiddleware, prizesController.closeRaffle.bind(prizesController));

router.delete('/:id', authMiddleware, adminMiddleware, prizesController.deletePrize.bind(prizesController));
router.patch('/:id', authMiddleware, adminMiddleware, prizesController.updatePrize.bind(prizesController));



export default router;


/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJpbmcuc2lzdGVtYXMyMDE5YXJtYW5kb0BnbWFpbC5jb20iLCJyb2xlSWQiOjEsImlhdCI6MTc1OTcwNDcwMCwiZXhwIjoxNzU5NzA4MzAwfQ.IngxKiGaGHFkaXbWMiDfttF3V5_wwyiCe5gsyLGqQAY
https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid
https://developers.google.com/oauthplayground/?code=4%2F0AVGzR1AVwRE8SfHbN3Yd9_V89dNneUD7sph-fkmXoIYjRdta3RW9fXNNyUnIE_cDqDW50g&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent
*/