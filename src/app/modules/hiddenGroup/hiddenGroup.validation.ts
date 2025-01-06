import { z } from 'zod';

const createHiddenValidation = z.object({
  body: z.object({
    hiddenByGroup: z.string(),
    hiddenGroup: z.string(),
  }),
});

export const hiddenGroupValidations = {
  createHiddenValidation,
};
