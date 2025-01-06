import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { TReview } from './review.interface';
import { Review } from './review.model';
import { User } from '../user/user.model';

const createReview = async (userId: string, payload: Partial<TReview>) => {
  payload.userId = new mongoose.Types.ObjectId(userId);

  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user  not found');
  }

  const result = await Review.create(payload);

  return result;
};

const getAllReviewByAdmin = async () => {
  const result = await Review.find().populate(
    'userId',
    'name email phone image',
  );

  return result;
};

const deleteReviewByAdmin = async (id: string) => {
  const isExistReview = await Review.findById(id);

  if (!isExistReview) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this review not found');
  }

  const result = await Review.findByIdAndDelete(id, { new: true });

  return result;
};

export const reviewServices = {
  createReview,
  getAllReviewByAdmin,
  deleteReviewByAdmin,
};
