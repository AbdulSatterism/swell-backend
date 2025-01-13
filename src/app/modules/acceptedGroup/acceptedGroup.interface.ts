import { Types } from 'mongoose';

export type TAcceptedGroup = {
  acceptedByGroupId: Types.ObjectId;
  acceptedGroupId: Types.ObjectId;
};
