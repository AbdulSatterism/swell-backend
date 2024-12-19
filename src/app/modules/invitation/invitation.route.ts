/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';

import { invitationController } from './invitation.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { invitationValidation } from './invitationValidation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.post(
  '/send-invitation',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  validateRequest(invitationValidation.sendValidationSchema),
  invitationController.sendInvitaion,
);

router.post('/updated/:id', invitationController.updatedInvited);

export const invitatioinRoutes = router;
