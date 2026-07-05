import express from 'express';

const app = express();

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — this route is used to check server health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dateTime: new Date().toISOString() });
});

export default app;