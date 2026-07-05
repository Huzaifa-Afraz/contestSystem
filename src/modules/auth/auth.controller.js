import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) throw new ApiError(400, 'Email, username, and password are required');
  if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');

  const result = await authService.register({ email, password, username });
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const result = await authService.login({ email, password });
  res.status(200).json(result);
});


export const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json(user);
});