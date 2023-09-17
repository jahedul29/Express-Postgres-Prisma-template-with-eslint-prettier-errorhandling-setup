import { UserRole } from '@prisma/client';
import { z } from 'zod';

const signUp = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'email is required',
      })
      .email({
        message: 'Invalid email address',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.enum([...Object.values(UserRole)] as [string, ...string[]], {
      required_error: 'User role is required',
    }),
    contactNo: z.string({
      required_error: 'ContactNo is required',
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    profileImg: z.string().optional(),
  }),
});

const login = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email({
        message: 'Invalid email address',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshToken = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
});

export const AuthZodValidation = {
  signUp,
  login,
  refreshToken,
  changePassword,
};
