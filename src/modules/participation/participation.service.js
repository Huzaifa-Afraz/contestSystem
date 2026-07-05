import prisma from '../../config/prisma.js';
import ApiError from '../../utils/ApiError.js';
import { scoreQuestion } from './scoring.js';

// Access rule from the brief: VIP/ADMIN can access anything; NORMAL only NORMAL contests.
const canAccess = (userRole, accessLevel) => {
  if (userRole === 'ADMIN' || userRole === 'VIP') return true;
  return accessLevel === 'NORMAL';
};

export const joinContest = async (user, contestId) => {
  const contest = await prisma.contest.findUnique({ where: { id: contestId } });
  if (!contest) throw new ApiError(404, 'Contest not found');

  if (!canAccess(user.role, contest.accessLevel)) {
    throw new ApiError(403, 'You do not have access to this contest');
  }

  const now = new Date();
  if (now < contest.startTime) throw new ApiError(400, 'This contest has not started yet');
  if (now > contest.endTime) throw new ApiError(400, 'This contest has ended');

  // Idempotent: if they already joined, return the existing participation.
  const existing = await prisma.participation.findUnique({
    where: { userId_contestId: { userId: user.id, contestId } },
  });
  if (existing) return existing;

  return prisma.participation.create({
    data: { userId: user.id, contestId, status: 'IN_PROGRESS' },
  });
};

export const submitAnswers = async (user, contestId, answers) => {
  // Load the contest WITH correct answers — this is server-side, so isCorrect is allowed here.
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: { questions: { include: { options: true } } },
  });
  if (!contest) throw new ApiError(404, 'Contest not found');

  if (!canAccess(user.role, contest.accessLevel)) {
    throw new ApiError(403, 'You do not have access to this contest');
  }

  const now = new Date();
  if (now > contest.endTime) throw new ApiError(400, 'This contest has ended');

  const participation = await prisma.participation.findUnique({
    where: { userId_contestId: { userId: user.id, contestId } },
  });
  if (!participation) throw new ApiError(400, 'You must join the contest before submitting');
  if (participation.status === 'SUBMITTED') {
    throw new ApiError(409, 'You have already submitted this contest');
  }

  // Index questions by id, and reject answers to questions not in this contest.
  const questionMap = new Map(contest.questions.map((q) => [q.id, q]));
  for (const a of answers) {
    if (!questionMap.has(a.questionId)) {
      throw new ApiError(400, `Question ${a.questionId} is not part of this contest`);
    }
  }

  // Score each answer using the pure engine, and build the Response rows.
  let totalScore = 0;
  const responseData = answers.map((a) => {
    const question = questionMap.get(a.questionId);
    const { isCorrect, awardedPoints } = scoreQuestion(question, a.selectedOptionIds);
    totalScore += awardedPoints;

    return {
      questionId: a.questionId,
      isCorrect,
      awardedPoints,
      selectedOptions: { connect: a.selectedOptionIds.map((id) => ({ id })) },
    };
  });

  // Persist everything atomically: create responses + finalize participation together.
  const [updated] = await prisma.$transaction([
    prisma.participation.update({
      where: { id: participation.id },
      data: {
        status: 'SUBMITTED',
        score: totalScore,
        submittedAt: new Date(),
        responses: { create: responseData },
      },
    }),
  ]);

  const maxScore = contest.questions.reduce((sum, q) => sum + q.points, 0);
  return { participationId: updated.id, score: totalScore, maxScore };
};