import express from 'express';
import authRoutes from './modules/auth/auth.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import contestRoutes from './modules/contest/contest.route.js';
const app = express();

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
// Health check — this route is used to check server health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dateTime: new Date().toISOString() });
});
app.use(errorMiddleware);

export default app;