import { Types } from 'mongoose';

export type TInvitation = {
  senderGroupId: Types.ObjectId;
  receiverGroupId: Types.ObjectId;
  userId?: Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
};
