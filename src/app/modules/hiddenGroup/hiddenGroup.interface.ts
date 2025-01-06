import { Types } from 'mongoose';

export type THiddenGroup = {
  hiddenByGroup: Types.ObjectId;
  hiddenGroup: Types.ObjectId;
};
