import asyncHandler from '../../utils/asyncHandler.js';
import * as service from './me.service.js';

export const myParticipations = asyncHandler(async (req, res) => {
  res.json(await service.getMyParticipations(req.user.id));
});

export const myPrizes = asyncHandler(async (req, res) => {
  res.json(await service.getMyPrizes(req.user.id));
});