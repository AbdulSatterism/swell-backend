import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';

import { UserRoutes } from '../app/modules/user/user.route';
import { groupRoutes } from '../app/modules/group/group.route';
import { invitatioinRoutes } from '../app/modules/invitation/invitation.route';
import { NotificationRoutes } from '../app/modules/notifications/notifications.route';
import { settingRoutes } from '../app/modules/setting/setting.route';
import { messageRoutes } from '../app/modules/message/message.route';
import { chatGroupRoutes } from '../app/modules/chatGroup/chatGroup.route';
import { privacyRoutes } from '../app/modules/privacy/privacy.routes';
import { aboutRoutes } from '../app/modules/aboutUs/aboutUs.route';
import { reviewRoutes } from '../app/modules/review/review.route';
import { hiddenGroupRoutes } from '../app/modules/hiddenGroup/hiddenGroup.route';
const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/group', route: groupRoutes },
  { path: '/chat', route: chatGroupRoutes },
  { path: '/invite', route: invitatioinRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/message', route: messageRoutes },
  { path: '/setting', route: settingRoutes },
  { path: '/privacy', route: privacyRoutes },
  { path: '/about', route: aboutRoutes },
  { path: '/review', route: reviewRoutes },
  { path: '/hidden', route: hiddenGroupRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
