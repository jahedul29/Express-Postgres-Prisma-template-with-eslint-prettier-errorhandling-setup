import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserZodValidation } from './user.validation';

const userRouter = express.Router();

userRouter.get('/', auth(UserRole.ADMIN), UserController.findAll);
userRouter.get('/:id', auth(UserRole.ADMIN), UserController.findOne);
userRouter.patch(
  '/:id',
  validateRequest(UserZodValidation.update),
  auth(UserRole.ADMIN),
  UserController.updateOne
);
userRouter.delete('/:id', auth(UserRole.ADMIN), UserController.deleteOne);

export const UserRouter = userRouter;
