import { model, Schema } from 'mongoose';
import { THiddenGroup } from './hiddenGroup.interface';

const hiddenGroupSchema = new Schema<THiddenGroup>(
  {
    hiddenByGroupId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
    hiddenGroupId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
  },
  { timestamps: true },
);

export const HiddenGroup = model<THiddenGroup>(
  'HiddenGroup',
  hiddenGroupSchema,
);
