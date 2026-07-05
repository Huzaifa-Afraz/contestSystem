import { z } from 'zod';

export const submitSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        selectedOptionIds: z.array(z.number().int().positive()),
      })
    )
    .min(1, 'You must answer at least one question'),
});