import { Types } from 'mongoose';

export interface TReview {
  userId: Types.ObjectId;
  comment: string;
}
