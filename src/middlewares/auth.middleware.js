import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

// "Who are you?" — verifies the JWT and attaches the user to the request.
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required'));
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Everything downstream reads req.user — this is the single source of "who".
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

// "Are you allowed?" — a factory: authorize('ADMIN') or authorize('VIP', 'ADMIN').
export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }

  next();
};