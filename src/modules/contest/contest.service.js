import prisma from '../../config/prisma.js';
import ApiError from '../../utils/ApiError.js';

// Admin create: one nested write creates the contest, its questions, and their options.
export const createContest = async (data) => {
  return prisma.contest.create({
    data: {
      name: data.name,
      description: data.description,
      accessLevel: data.accessLevel,
      startTime: data.startTime,
      endTime: data.endTime,
      prizeInfo: data.prizeInfo,
      questions: {
        create: data.questions.map((q) => ({
          text: q.text,
          type: q.type,
          points: q.points,
          options: {
            create: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
          },
        })),
      },
    },
    include: { questions: { include: { options: true } } },
  });
};

// Public list — metadata only, no questions.
export const listContests = async () => {
  return prisma.contest.findMany({
    orderBy: { startTime: 'desc' },
    select: {
      id: true, name: true, description: true, accessLevel: true,
      startTime: true, endTime: true, prizeInfo: true,
    },
  });
};

// Public detail — includes questions + options but STRIPS isCorrect.
export const getContestById = async (id) => {
  const contest = await prisma.contest.findUnique({
    where: { id },
    select: {
      id: true, name: true, description: true, accessLevel: true,
      startTime: true, endTime: true, prizeInfo: true,
      questions: {
        select: {
          id: true, text: true, type: true, points: true,
          options: {
            select: { id: true, text: true }, // isCorrect deliberately NOT selected
          },
        },
      },
    },
  });

  if (!contest) throw new ApiError(404, 'Contest not found');
  return contest;
};