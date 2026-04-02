import { Router } from 'express';
import { UserController } from './user.controller';
import { createDoctorZodSchema } from './user.validation';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/create-doctors',
  validateRequest(createDoctorZodSchema),

  UserController.createDoctor,
);
// router.post('/create-admin', UserController.createDoctor);
// router.post('/create-superadmin', UserController.createDoctor);

export const UserRoutes = router;
