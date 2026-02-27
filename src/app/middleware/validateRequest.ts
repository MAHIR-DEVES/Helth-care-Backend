import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = schema.safeParse(req.body);

    if (!parsedResult.success) {
      return next(parsedResult.error);
    }

    // Sanitizing the data
    req.body = parsedResult.data;
    next();
  };
};
