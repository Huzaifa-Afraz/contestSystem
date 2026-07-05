import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import * as service from './participation.service.js';

const parseContestId = (req) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new ApiError(400, 'Invalid contest id');
  return id;
};

export const join = asyncHandler(async (req, res) => {
  const participation = await service.joinContest(req.user, parseContestId(req));
  res.status(201).json(participation);
});

export const submit = asyncHandler(async (req, res) => {
  const result = await service.submitAnswers(req.user, parseContestId(req), req.body.answers);
  res.status(200).json(result);
});