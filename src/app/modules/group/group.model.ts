import { model, Schema, Types } from "mongoose";
import { TGroup } from "./group.interface";

const groupSchema: Schema = new Schema<TGroup>(
    {
      groupName: {
        type: String,
        default:'',
        trim: true,
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      invite: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: "User",
      },
      coverPhoto: {
        type: String,
      },
      address: {
        type: String,
        required: true,
      },
      bio: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHERS"],
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );
  
  export const Group =  model<TGroup>("Group", groupSchema);