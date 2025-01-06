import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    userId: { type: Schema.Types.ObjectId, default: null, ref: 'User' },

    comment: { type: String, required: true },
  },
  { timestamps: true },
);

export const Review = model<TReview>('Review', reviewSchema);
