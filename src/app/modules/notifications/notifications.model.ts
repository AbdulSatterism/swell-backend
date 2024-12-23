import { model, Schema } from 'mongoose';
import { TNotification } from './notifications.interface';

const notificationSchema = new Schema<TNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    receiverGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    invitationId: {
      type: Schema.Types.ObjectId,
      ref: 'Invitation',
      required: true,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = model<TNotification>(
  'Notification',
  notificationSchema,
);
