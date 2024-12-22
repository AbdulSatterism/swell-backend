import { Types } from 'mongoose';

export type TMessage = {
  roomId: string;
  senderId: Types.ObjectId;
  message: string;
};
