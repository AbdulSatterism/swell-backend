import { z } from 'zod';

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS']),
    birthday: z.string(),
    password: z.string().min(6, "Password must have at least 6 characters"),

  }),
});

const updateUserProfileSchema = z.object({
  school: z.string().optional(),
  address: z.string().optional(),
  instagram: z.string().optional(),
  name:z.string().optional()
});


const updateLocationZodSchema = z.object({
  body: z.object({
    longitude: z.string({ required_error: 'Longitude is required' }),
    latitude: z.string({ required_error: 'Latitude is required' }),
  }),
});

export const UserValidation = {
  createUserSchema,
  updateLocationZodSchema,
  updateUserProfileSchema
};
