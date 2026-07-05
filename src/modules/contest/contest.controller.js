import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import * as contestService from './contest.service.js';

export const create = asyncHandler(async (req, res) => {
  const contest = await contestService.createContest(req.body);
  res.status(201).json(contest);
});

export const list = asyncHandler(async (req, res) => {
  const result = await contestService.listContests(req.query);
  res.json(result);
});

export const getOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new ApiError(400, 'Invalid contest id');

  const contest = await contestService.getContestById(id);
  res.json(contest);
});

export const leaderboard = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new ApiError(400, 'Invalid contest id');
  const result = await contestService.getLeaderboard(id, req.query);
  res.json(result);
});