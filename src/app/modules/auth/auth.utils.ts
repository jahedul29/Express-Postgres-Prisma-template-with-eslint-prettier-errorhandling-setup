import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';

const isUserExist = async (email: string): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};

const isPasswordMatch = async (
  givenPassword: string,
  userPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(givenPassword, userPassword);
};

export const AuthUtils = {
  isUserExist,
  isPasswordMatch,
};
