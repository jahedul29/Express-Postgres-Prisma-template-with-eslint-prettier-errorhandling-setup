import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthZodValidation } from './auth.validation';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateRequest(AuthZodValidation.signUp),
  AuthController.signUp
);

authRouter.post(
  '/signin',
  validateRequest(AuthZodValidation.login),
  AuthController.login
);

authRouter.post(
  '/refresh-token',
  validateRequest(AuthZodValidation.refreshToken),
  AuthController.refreshToken
);

authRouter.patch(
  '/change-password',
  validateRequest(AuthZodValidation.changePassword),
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  AuthController.changePassword
);

export const AuthRouter = authRouter;
