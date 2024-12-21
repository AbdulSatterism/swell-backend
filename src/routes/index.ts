import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';

import { UserRoutes } from '../app/modules/user/user.route';
import { groupRoutes } from '../app/modules/group/group.route';
import { invitatioinRoutes } from '../app/modules/invitation/invitation.route';
import { NotificationRoutes } from '../app/modules/notifications/notifications.route';
import { settingRoutes } from '../app/modules/setting/setting.route';
import { messageRoutes } from '../app/modules/message/message.route';
const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/group', route: groupRoutes },
  { path: '/invite', route: invitatioinRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/setting', route: settingRoutes },
  { path: '/message', route: messageRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
