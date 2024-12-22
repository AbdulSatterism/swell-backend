/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

import validateRequest from '../../middlewares/validateRequest';
import { messageValidations } from './message.validation';
import { messageControllers } from './message.controller';
const router = express.Router();

router.post(
  '/send-message',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(messageValidations.createMessageValidationSchema),
  messageControllers.createMessage,
);

router.get(
  '/:roomId',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  messageControllers.showAllMessageSpeceficGroup,
);

// router.patch(
//   '/update-setting',
//   auth(USER_ROLES.ADMIN),
//   validateRequest(settingValidaitons.updateSettingValidation),
//   settingControllers.updateSetting,
// );

export const messageRoutes = router;
