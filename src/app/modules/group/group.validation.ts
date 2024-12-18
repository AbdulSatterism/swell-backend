import { z } from "zod";

const createGroupValidationSchema = z.object({
    createdBy: z.string(),
    invite: z.array(z.string()),
    address: z.string(),
    bio: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.object({
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
    }),
  });


  export const groupValidations ={
    createGroupValidationSchema
  }