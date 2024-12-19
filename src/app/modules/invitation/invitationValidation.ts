import { z } from 'zod';

const sendValidationSchema = z.object({
  body: z.object({
    senderGroupId: z.string(),
    receiverGroupId: z.string(),
  }),
});

export const invitationValidation = { sendValidationSchema };
