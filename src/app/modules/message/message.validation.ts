import { z } from 'zod';

const createMessageValidationSchema = z.object({
  body: z.object({
    chatGroupId: z.string(),
    senderId: z.string(),
    message: z.string().min(1, 'Message cannot be empty'),
  }),
});

export const messageValidations = {
  createMessageValidationSchema,
};
