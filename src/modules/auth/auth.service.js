import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';
import ApiError from '../../utils/ApiError.js';

const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const register = async ({ email, password, username }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, 'Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, username },
    select: { id: true, email: true, username:true, role: true, createdAt: true }, // never return the hash
  });

  return { user, token: signToken(user) };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  // Same error whether the email is unknown or the password is wrong —
  // don't leak which emails have accounts.
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw new ApiError(401, 'Invalid credentials');

  return {
    user: { id: user.id, email: user.email, username: user.username, role: user.role },
    token: signToken(user),
  };
};


export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true, role: true, createdAt: true },
  });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};