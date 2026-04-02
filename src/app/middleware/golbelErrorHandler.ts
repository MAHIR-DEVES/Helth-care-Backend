/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { envVars } from '../config/env';
import status from 'http-status';
import z from 'zod';
import { IErrorResponse, IErrorSource } from '../interface/error.interface';
import { handleZodError } from '../errorHelpers/handleZodError';
import AppError from '../errorHelpers/AppError';
import { deleteFileFromCloudinary } from '../config/cloudinary.config';
import { deleteUploadedFilesFromGlobalErrorHandler } from '../utils/deleteUploadedFilesFromGlobalErrorHandler';
import { Prisma } from '../../generated/prisma/client';
import {
  handlePrismaClientKnownRequestError,
  handlePrismaClientUnknownError,
  handlePrismaClientValidationError,
  handlerPrismaClientInitializationError,
  handlerPrismaClientRustPanicError,
} from '../errorHelpers/handlePrismaErrors';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === 'development') {
    console.log('Error From Global Error Handler:', err);
  }

  // if (req.file) {
  //   await deleteFileFromCloudinary(req.file.path);
  // }

  // if (req.files && Array.isArray(req.files) && req.files.length > 0) {
  //   const imageUrls = req.files.map(file => file.path);
  //   await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url)));
  // }

  await deleteUploadedFilesFromGlobalErrorHandler(req);

  let errorSources: IErrorSource[] = [];

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = 'Internal Server Error';
  let stack: string | undefined = undefined;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  const errorResponse: IErrorResponse = {
    success: false,
    message: message,
    errorSources,
    stack: envVars.NODE_ENV === 'development' ? stack : undefined,
    error: envVars.NODE_ENV === 'development' ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
