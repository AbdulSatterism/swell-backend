import { Model, Types } from 'mongoose';

export interface TNotification {
  userId: Types.ObjectId;
  senderGroupId: Types.ObjectId;
  receiverGroupId: Types.ObjectId;
  invitationId: Types.ObjectId;
  message: string;
}
export type Notification = Model<TNotification>;
