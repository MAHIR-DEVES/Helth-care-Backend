/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { specialtyService } from './specialty.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialtyService.createSpecialty(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'specialty created successfully',
    data: result,
  });
});

const getAllSpecialty = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpecialty();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'specialty fetched successfully',
    data: result,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await specialtyService.deleteSpecialty(id as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'specialty deleted successfully',
  });
});

export const specialtyController = {
  createSpecialty,
  getAllSpecialty,
  deleteSpecialty,
};
