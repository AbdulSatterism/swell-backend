import { model, Schema } from 'mongoose';
import { TGroup } from './group.interface';

const groupSchema: Schema = new Schema<TGroup>(
  {
    groupName: {
      type: String,
      default: 'group',
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    invite: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'User',
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
      enum: ['MALE', 'FEMALE', 'OTHERS'],
      required: true,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number] }, //[example:longtitude->90.413, latitude->23.456]..must follow this format otherwise error
    },
  },
  {
    timestamps: true,
  },
);

groupSchema.index({ location: '2dsphere' });

export const Group = model<TGroup>('Group', groupSchema);
