/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

import validateRequest from '../../middlewares/validateRequest';
import { reviewValidations } from './review.validation';
import { reviewControllers } from './review.controller';
const router = express.Router();

router.post(
  '/create-review',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(reviewValidations.createReviewValidation),
  reviewControllers.createReview,
);

router.get('/', auth(USER_ROLES.ADMIN), reviewControllers.getAllReviewByAdmin);

router.get(
  '/single-review/:id',
  auth(USER_ROLES.ADMIN),
  reviewControllers.getSingleUserReview,
);

router.post(
  '/review-delete/:id',
  auth(USER_ROLES.ADMIN),
  reviewControllers.deleteReviewByAdmin,
);

export const reviewRoutes = router;
