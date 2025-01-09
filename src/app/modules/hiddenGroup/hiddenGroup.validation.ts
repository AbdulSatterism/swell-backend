import { z } from 'zod';

const createHiddenValidation = z.object({
  body: z.object({
    hiddenByGroupId: z.string(),
    hiddenGroupId: z.string(),
  }),
});

export const hiddenGroupValidations = {
  createHiddenValidation,
};
