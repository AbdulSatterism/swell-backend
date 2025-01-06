import { model, Schema } from 'mongoose';
import { THiddenGroup } from './hiddenGroup.interface';

const hiddenGroupSchema = new Schema<THiddenGroup>(
  {
    hiddenByGroup: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
    hiddenGroup: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
  },
  { timestamps: true },
);

export const HiddenGroup = model<THiddenGroup>(
  'HiddenGroup',
  hiddenGroupSchema,
);
