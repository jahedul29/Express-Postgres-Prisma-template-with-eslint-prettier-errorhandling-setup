import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { JwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { UserUtils } from '../user/user.utils';
import {
  ILoginResponse,
  ILoginUser,
  IRefreshTokenResponse,
} from './auth.interface';
import { AuthUtils } from './auth.utils';

const signUp = async (payload: User): Promise<User | null> => {
  payload.password = await UserUtils.hashPassword(payload.password);

  const result = await prisma.user.create({
    data: payload,
  });

  return result;
};

const login = async (payload: ILoginUser): Promise<ILoginResponse> => {
  const { email, password } = payload;

  const isUserExist = await AuthUtils.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await AuthUtils.isPasswordMatch(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password not match');
  }

  // Calculate the timestamp for 1 year ago
  // const oneYearInSeconds = 365 * 24 * 60 * 60; // 1 year in seconds
  // const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  // const iat = currentTimestamp - oneYearInSeconds; // 1 year ago

  const accessToken = await JwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = await JwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  refreshToken: string
): Promise<IRefreshTokenResponse> => {
  let verifiedData = null;
  try {
    verifiedData = JwtHelpers.verifyToken(
      refreshToken,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not valid');
  }

  const { id: userId } = verifiedData;

  const isUserExist = await AuthUtils.isUserExist(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Calculate the timestamp for 1 year ago
  const oneYearInSeconds = 365 * 24 * 60 * 60; // 1 year in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const iat = currentTimestamp - oneYearInSeconds; // 1 year ago

  const accessToken = await JwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role, iat },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<User | null> => {
  const { oldPassword, newPassword } = payload;

  // const isUserExist = await prisma.user.findFirst({ id: user?.id }).select('+password');
  const isUserExist = await prisma.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await AuthUtils.isPasswordMatch(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password not match');
  }

  isUserExist.password = newPassword;

  // await isUserExist.save();
  const result = await prisma.user.update({
    where: {
      id: isUserExist?.id,
    },
    data: isUserExist,
  });

  return result;
};

export const AuthService = {
  signUp,
  login,
  refreshToken,
  changePassword,
};
