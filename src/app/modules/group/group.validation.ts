import { z } from "zod";

const createGroupValidationSchema = z.object({
    createdBy: z.string(),
    invite: z.array(z.string()),
    address: z.string(),
    bio: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    latitude: z.number(),
    longitude: z.number(),
    location: z.string(),
  });


  export const groupValidations ={
    createGroupValidationSchema
  }