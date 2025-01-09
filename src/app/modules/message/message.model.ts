import { model, Schema } from 'mongoose';
import { TMessage } from './message.interface';

const messageSchema = new Schema<TMessage>(
  {
    roomId: {
      type: String,
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Group ID to which the message belongs
    groupId: { type: Schema.Types.ObjectId, ref: 'ChatGroup', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Message = model<TMessage>('Message', messageSchema);
