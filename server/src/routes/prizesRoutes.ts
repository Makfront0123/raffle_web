
import express from 'express';

import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrizesController } from '../controllers/prizesController';

const router = express.Router();
const prizesController = new PrizesController();

router.get('/', authMiddleware, prizesController.getAllPrizes);
router.post('/', authMiddleware, adminMiddleware, prizesController.createPrize);
router.post('/:id/select-winner', prizesController.selectWinner.bind(prizesController));
router.post('/:raffleId/close-raffle', authMiddleware, adminMiddleware, prizesController.closeRaffle.bind(prizesController));
router.get('/:raffleId/winners', authMiddleware, prizesController.getWinners.bind(prizesController));
router.delete('/:id', authMiddleware, adminMiddleware, prizesController.deletePrize);
router.patch('/:id', authMiddleware, adminMiddleware, prizesController.updatePrize);

export default router;

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJpbmcuc2lzdGVtYXMyMDE5YXJtYW5kb0BnbWFpbC5jb20iLCJyb2xlSWQiOjEsImlhdCI6MTc1OTcwNDcwMCwiZXhwIjoxNzU5NzA4MzAwfQ.IngxKiGaGHFkaXbWMiDfttF3V5_wwyiCe5gsyLGqQAY
https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid
https://developers.google.com/oauthplayground/?code=4%2F0AVGzR1AVwRE8SfHbN3Yd9_V89dNneUD7sph-fkmXoIYjRdta3RW9fXNNyUnIE_cDqDW50g&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent
*/