import { Types } from 'mongoose';

export type TMessage = {
  roomId: string;
  // Group ID to which the message belongs
  groupId: Types.ObjectId;
  senderId: Types.ObjectId;
  message: string;
  read: boolean;
};
