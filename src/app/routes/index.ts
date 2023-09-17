import express from 'express';
import { AuthRouter } from '../modules/auth/auth.router';
import { UserRouter } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
