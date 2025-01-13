/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
// import { USER_ROLES } from '../../../enums/user';
// import auth from '../../middlewares/auth';
import { chatGroupControllers } from './chatGroup.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

//get specific user group
router.get(
  '/user-chatgroup',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  chatGroupControllers.allUserChattingGroup,
);

router.get(
  '/group-list/:groupId',
  // auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  chatGroupControllers.chatGroupList,
);

export const chatGroupRoutes = router;
