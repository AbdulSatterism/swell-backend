import { model, Schema } from 'mongoose';
import { TChatGroup } from './chatGroup.interface';

const chatGroupSchema = new Schema<TChatGroup>(
  {
    inviterGroup: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
    receiverGroup: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
  },
  { timestamps: true },
);

export const ChatGroup = model<TChatGroup>('ChatGroup', chatGroupSchema);
