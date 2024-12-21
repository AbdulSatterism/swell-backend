import { z } from 'zod';

const sendValidationSchema = z.object({
  body: z.object({
    senderGroupId: z.string(),
    receiverGroupId: z.string(),
  }),
});

const sendInvitationResponse = z.object({
  body: z.object({
    invitationId: z.string(),
    response: z.enum(['ACCEPTED', 'REJECTED']),
  }),
});

export const invitationValidation = {
  sendValidationSchema,
  sendInvitationResponse,
};
