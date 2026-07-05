import prisma from '../../config/prisma.js';
import ApiError from '../../utils/ApiError.js';
import { getPagination, buildMeta } from '../../utils/pagination.js';
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

export const listContests = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const [contests, total] = await prisma.$transaction([
    prisma.contest.findMany({
      orderBy: { startTime: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, name: true, description: true, accessLevel: true,
        startTime: true, endTime: true, prizeInfo: true,
      },
    }),
    prisma.contest.count(),
  ]);

  return { data: contests, meta: buildMeta(total, page, limit) };
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

export const getLeaderboard = async (contestId, query) => {
  const contest = await prisma.contest.findUnique({ where: { id: contestId } });
  if (!contest) throw new ApiError(404, 'Contest not found');

  const { page, limit, skip } = getPagination(query);

  const [rows, total] = await prisma.$transaction([
    prisma.participation.findMany({
      where: { contestId, status: 'SUBMITTED' },
      orderBy: [{ score: 'desc' }, { submittedAt: 'asc' }],
      skip,
      take: limit,
      select: {
        score: true,
        submittedAt: true,
        user: { select: { id: true, username: true } },
      },
    }),
    prisma.participation.count({ where: { contestId, status: 'SUBMITTED' } }),
  ]);

  const data = rows.map((row, i) => ({ rank: skip + i + 1, ...row }));
  return { data, meta: buildMeta(total, page, limit) };
};