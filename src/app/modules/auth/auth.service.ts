import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { TokenUtils } from '../../utils/token';

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      // default
      // role: Role.PATIENT,
    },
  });

  if (!data.user) {
    // throw new Error('Failed to register patient');
    throw new AppError(status.BAD_REQUEST, 'Failed to register patient');
  }
  const accessToken = TokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = TokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

interface ILoginUserPayload {
  email: string;
  password: string;
}

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: { email, password },
  });

  if (data.user.status === 'BLOCKED') {
    throw new AppError(
      status.FORBIDDEN,
      'Your account is blocked. Please contact support.',
    );
  }

  if (data.user.isDeleted || data.user.status === 'DELETED') {
    throw new AppError(
      status.NOT_FOUND,
      'Your account is deleted. Please contact support.',
    );
  }

  const accessToken = TokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = TokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  try {
    const patient = await prisma.$transaction(async tx => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: data.user.name,
          email: data.user.email,
        },
      });
      return patientTx;
    });

    return {
      ...data,
      patient,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log('transaction error', error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

export const authService = {
  registerPatient,
  loginUser,
};
