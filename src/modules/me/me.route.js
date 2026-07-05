import { Router } from 'express';
import * as controller from './me.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/participations', authenticate, controller.myParticipations);
router.get('/prizes', authenticate, controller.myPrizes);

export default router;