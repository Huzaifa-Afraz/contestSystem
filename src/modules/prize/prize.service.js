import prisma from '../../config/prisma.js';

// Award the prize for ONE contest, if eligible. Safe to call repeatedly.
export const awardPrizeForContest = async (contestId) => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: { prize: true },
  });

  if (!contest) return null;
  if (contest.prize) return contest.prize;          // already awarded
  if (new Date() <= contest.endTime) return null;   // not ended yet
  if (!contest.prizeInfo) return null;              // nothing to award

  // Winner = top of the leaderboard, with a score above zero.
  const winner = await prisma.participation.findFirst({
    where: { contestId, status: 'SUBMITTED', score: { gt: 0 } },
    orderBy: [{ score: 'desc' }, { submittedAt: 'asc' }],
  });

  if (!winner) return null; // no eligible participants

  // @unique on contestId means this can't create a duplicate even under a race.
  return prisma.prize.create({
    data: { info: contest.prizeInfo, contestId, userId: winner.userId },
  });
};

// Scan all ended-but-unawarded contests and award them. Called on a schedule.
export const awardEndedContests = async () => {
  const contests = await prisma.contest.findMany({
    where: { endTime: { lt: new Date() }, prize: { is: null } },
    select: { id: true },
  });

  const awarded = [];
  for (const c of contests) {
    const prize = await awardPrizeForContest(c.id);
    if (prize) awarded.push(prize);
  }
  return awarded;
};