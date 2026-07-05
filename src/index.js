import dotenv from 'dotenv';
import app from './app.js';
import { startPrizeJob } from './jobs/prize.job.js';
dotenv.config();


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

startPrizeJob();