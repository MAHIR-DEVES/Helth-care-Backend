/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { Role, UserStatus } from '../../generated/prisma/enums';
import { CookieUtils } from '../utils/cookie';
import { prisma } from '../lib/prisma';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';
import { JWTUtils } from '../utils/jwt';
import { envVars } from '../config/env';

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // session token verification
      const sessionToken = CookieUtils.getCookie(
        req,
        'better-auth.session_token',
      );

      if (!sessionToken) {
        throw new Error('Unauthorize access! no session token provided');
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;
          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader('X-Session-Refresh', 'true');
            res.setHeader('X-session-Expires-At', expiresAt.toISOString());
            res.setHeader('X-Time-Remaining', timeRemaining.toString());

            console.log('session expiring soon !');
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              'unauthorize access ! user is not active',
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              'unauthorize access ! user is deleted',
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              'forbidden access ! you do not have permission to access this resource  ',
            );
          }

          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }

        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
          throw new AppError(
            status.UNAUTHORIZED,
            'Unauthorize access! no access token provided',
          );
        }
      }

      //access token verification
      const accessToken = CookieUtils.getCookie(req, 'accessToken');
      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorized access ! no access token provided',
        );
      }
      const verifiedToken = JWTUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorized access ! invalid access token',
        );
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          'Forbidden access! you do not have permission to access this resource',
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
