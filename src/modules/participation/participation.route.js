import { Router } from 'express';
import * as controller from './participation.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { submitSchema } from './participation.validation.js';

const router = Router();

router.post('/:id/join', authenticate, controller.join);
router.post('/:id/submit', authenticate, validate(submitSchema), controller.submit);

export default router;