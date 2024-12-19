import { Types } from 'mongoose';

export type TInvitation = {
  senderGroupId: Types.ObjectId;
  receiverGroupId: Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
};
