import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

const hashPassword = async (password: string) => {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bycrypt_salt_rounds)
    );

    return hashedPassword;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong when hashing password'
    );
  }
};

export const UserUtils = { hashPassword };
