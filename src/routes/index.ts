import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';

import { UserRoutes } from '../app/modules/user/user.route';
import { groupRoutes } from '../app/modules/group/group.route';
const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/group', route: groupRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
