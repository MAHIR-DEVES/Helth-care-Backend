import { Router } from 'express';
import { SpecialtyRoutes } from '../modules/specialty/specialty.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/specialty', SpecialtyRoutes);
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);
router.use('/admins', AdminRoutes);

export const IndexRoute = router;
