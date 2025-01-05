import { z } from 'zod';

const createReviewValidation = z.object({
  body: z.object({
    comment: z.string(),
    userId: z.string(),
  }),
});

const updateReviewValidatioin = z.object({
  body: z.object({
    comment: z.string().optional(),
  }),
});

export const reviewValidations = {
  createReviewValidation,
  updateReviewValidatioin,
};
