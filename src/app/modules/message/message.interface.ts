import { Types } from 'mongoose';

export type TMessage = {
  chatGroupId: Types.ObjectId;
  senderId: Types.ObjectId;
  message: string;
};
