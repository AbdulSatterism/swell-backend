// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-unused-vars */
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { reviewServices } from './review.services';

const createReview = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await reviewServices.createReview(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'review created succefully',
    data: result,
  });
});
const getAllReviewByAdmin = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviewByAdmin();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'all review retrieve succefully',
    data: result,
  });
});

const getSingleUserReview = catchAsync(async (req, res) => {
  const result = await reviewServices.getSingleUserReview(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'review retrieve succefully',
    data: result,
  });
});

const deleteReviewByAdmin = catchAsync(async (req, res) => {
  const result = await reviewServices.deleteReviewByAdmin(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'review deleted succefully',
    data: result,
  });
});

export const reviewControllers = {
  createReview,
  getAllReviewByAdmin,
  deleteReviewByAdmin,
  getSingleUserReview,
};
