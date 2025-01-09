import { z } from 'zod';

const createMessageValidationSchema = z.object({
  body: z.object({
    roomId: z.string(),
    senderId: z.string(),
    // groupId: z.string(),
    message: z.string().min(1, 'Message cannot be empty'),
  }),
});

export const messageValidations = {
  createMessageValidationSchema,
};
