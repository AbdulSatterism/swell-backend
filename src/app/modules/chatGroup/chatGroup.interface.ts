import { Types } from 'mongoose';

export type TChatGroup = {
  inviterGroup: Types.ObjectId;
  receiverGroup: Types.ObjectId;
};
