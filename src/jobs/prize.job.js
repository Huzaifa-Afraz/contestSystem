import cron from 'node-cron';
import { awardEndedContests } from '../modules/prize/prize.service.js';

export const startPrizeJob = () => {
  // every minute
  cron.schedule('* * * * *', async () => {
    try {
      const awarded = await awardEndedContests();
      if (awarded.length) console.log(`🏆 Awarded ${awarded.length} prize(s)`);
    } catch (err) {
      console.error('Prize job failed:', err);
    }
  });
  console.log('⏰ Prize awarding job scheduled');
};