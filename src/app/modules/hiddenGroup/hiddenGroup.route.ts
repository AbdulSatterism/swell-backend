/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { hiddenGroupValidations } from './hiddenGroup.validation';
import { hiddenGroupControllers } from './hiddenGroup.controller';

const router = express.Router();

router.post(
  '/create-hidden-group',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(hiddenGroupValidations.createHiddenValidation),
  hiddenGroupControllers.createHiddenGroup,
);

// router.get('/', auth(USER_ROLES.ADMIN), reviewControllers.getAllReviewByAdmin);

// router.post(
//   '/review-delete/:id',
//   auth(USER_ROLES.ADMIN),
//   reviewControllers.deleteReviewByAdmin,
// );

export const hiddenGroupRoutes = router;
