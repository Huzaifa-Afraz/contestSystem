import { Router } from 'express';
import * as contestController from './contest.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createContestSchema } from './contest.validation.js';

const router = Router();

// Public reads — no auth. Guests can view contests (per the brief).
router.get('/', contestController.list);
router.get('/:id', contestController.getOne);

// Admin-only create: authenticate -> authorize(ADMIN) -> validate -> controller
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createContestSchema),
  contestController.create
);

router.get('/:id/leaderboard', contestController.leaderboard);

export default router;