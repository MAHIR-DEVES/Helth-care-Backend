/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
): string => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

const verifyToken = (toke: string, secret: string) => {
  try {
    const decoded = jwt.verify(toke, secret) as JwtPayload;
    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};
const decodeToken = (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  return decoded;
};

export const JWTUtils = {
  createToken,
  verifyToken,
  decodeToken,
};
