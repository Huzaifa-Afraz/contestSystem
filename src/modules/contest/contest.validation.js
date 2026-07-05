import { z } from 'zod';

const optionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['SINGLE', 'MULTI', 'BOOLEAN']),
  points: z.number().int().positive().default(1),
  options: z.array(optionSchema).min(2, 'A question needs at least 2 options'),
});

export const createContestSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    accessLevel: z.enum(['NORMAL', 'VIP']).default('NORMAL'),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    prizeInfo: z.string().optional(),
    questions: z.array(questionSchema).min(1, 'A contest needs at least 1 question'),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'endTime must be after startTime',
    path: ['endTime'],
  });