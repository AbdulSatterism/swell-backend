import { model, Schema } from 'mongoose';
import { TAcceptedGroup } from './acceptedGroup.interface';

const acceptedGroupSchema = new Schema<TAcceptedGroup>(
  {
    acceptedByGroupId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
    acceptedGroupId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
  },
  { timestamps: true },
);

export const AcceptedGroup = model<TAcceptedGroup>(
  'AcceptedGroup',
  acceptedGroupSchema,
);
