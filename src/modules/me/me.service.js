import prisma from '../../config/prisma.js';

export const getMyParticipations = async (userId) => {
  return prisma.participation.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    select: {
      id: true,
      status: true,       // IN_PROGRESS or SUBMITTED — covers "in-progress" requirement
      score: true,
      startedAt: true,
      submittedAt: true,
      contest: { select: { id: true, name: true, accessLevel: true, endTime: true } },
    },
  });
};

export const getMyPrizes = async (userId) => {
  return prisma.prize.findMany({
    where: { userId },
    orderBy: { awardedAt: 'desc' },
    select: {
      id: true,
      info: true,
      awardedAt: true,
      contest: { select: { id: true, name: true } },
    },
  });
};