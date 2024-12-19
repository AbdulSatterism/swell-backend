import { model, Schema } from 'mongoose';
import { TChat } from './chatGroup.interface';

const chatSchema = new Schema<TChat>({
  group1: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  group2: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  messages: [
    {
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export const ChatGroup = model<TChat>('ChatGroup', chatSchema);
