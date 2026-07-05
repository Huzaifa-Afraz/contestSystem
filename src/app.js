import express from 'express';
import authRoutes from './modules/auth/auth.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import contestRoutes from './modules/contest/contest.route.js';
import participationRoutes from './modules/participation/participation.route.js';
import { apiLimiter, authLimiter } from './middlewares/rateLimit.middleware.js';
import meRoutes from './modules/me/me.route.js';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api', apiLimiter);            // applies to all /api routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contests', apiLimiter, contestRoutes);
app.use('/api/contests', apiLimiter, participationRoutes);
app.use('/api/me', apiLimiter, meRoutes);
// Health check — this route is used to check server health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dateTime: new Date().toISOString() });
});
app.use(errorMiddleware);

export default app;