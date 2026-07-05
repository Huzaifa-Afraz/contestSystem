import express from 'express';
import authRoutes from './modules/auth/auth.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import contestRoutes from './modules/contest/contest.route.js';
import participationRoutes from './modules/participation/participation.route.js';
import { apiLimiter, authLimiter } from './middlewares/rateLimit.middleware.js';
import meRoutes from './modules/me/me.route.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiLimiter);            // applies to all /api routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/contests', participationRoutes);
app.use('/api/me', meRoutes);
// Health check — this route is used to check server health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dateTime: new Date().toISOString() });
});
app.use(errorMiddleware);

export default app;