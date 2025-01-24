import { z } from 'zod';

const createGroupValidationSchema = z.object({
  createdBy: z.string(),
  groupName: z.string().optional(),
  invite: z.array(z.string()),
  address: z.string(),
  description: z.string(),
  bio: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHERS']),
  lookingFor: z.enum(['MALE', 'FEMALE', 'OTHERS']),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.array(z.number()),
  }),
});

const updateGroupValidationSchema = z.object({
  address: z.string().optional(),
  description: z.string().optional(),
  bio: z.string().optional(),
  groupName: z.string().optional(),
});

const leaveGroupValidationSchema = z.object({
  body: z.object({
    roomId: z.string(),
    userId: z.string(),
  }),
});

export const groupValidations = {
  createGroupValidationSchema,
  leaveGroupValidationSchema,
  updateGroupValidationSchema,
};
