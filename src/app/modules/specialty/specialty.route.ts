/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { specialtyController } from './specialty.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  specialtyController.createSpecialty,
);
router.get('/', specialtyController.getAllSpecialty);
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  specialtyController.deleteSpecialty,
);

export const SpecialtyRoutes = router;
