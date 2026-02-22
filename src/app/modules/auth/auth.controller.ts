import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { authService } from './auth.service';

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.registerPatient(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'patient registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'user logged in successfully',
    data: result,
  });
});

export const AuthController = {
  registerPatient,
  loginUser,
};
