import status from 'http-status';
import { IErrorResponse, IErrorSource } from '../interface/error.interface';
import z from 'zod';

export const handleZodError = (err: z.ZodError): IErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = 'Zod Validation Error';
  const errorSources: IErrorSource[] = [];

  err.issues.forEach(issue => {
    errorSources.push({
      path: issue.path.join(' => ') || 'unknown',
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSources,
    statusCode,
  };
};
