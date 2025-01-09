import { Types } from 'mongoose';

export type THiddenGroup = {
  hiddenByGroupId: Types.ObjectId;
  hiddenGroupId: Types.ObjectId;
};
