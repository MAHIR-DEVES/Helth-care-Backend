import z from 'zod';
import { Gender } from '../../../generated/prisma/enums';

export const createDoctorZodSchema = z.object({
  password: z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(20, 'Password must be less than 20 characters long'),
  doctor: z.object({
    name: z
      .string('Name is required')
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name must be less than 50 characters long'),
    email: z.email('Valid email is required'),
    contactNumber: z
      .string('Contact number is required')
      .min(11, 'Contact number must be at least 11 digits long')
      .max(14, 'Contact number must be less than 14 digits long'),
    address: z
      .string('Address is required')
      .min(10, 'Address must be at least 10 characters long')
      .max(100, 'Address must be less than 100 characters long')
      .optional(),
    registrationNumber: z.string('Registration number is required'),
    experience: z
      .int('Experience must be an integer')
      .nonnegative('Experience must be a non-negative integer')
      .optional(),
    gender: z.enum(
      [Gender.MALE, Gender.MALE],
      'Gender must be either MALE or FEMALE',
    ),
    appointmentFee: z
      .number('Appointment fee is required')
      .nonnegative('Appointment fee con not a number'),
    qualification: z
      .string('Qualification is required')
      .min(2, 'Qualification must be at least 2 characters long')
      .max(100, 'Qualification must be less than 100 characters long'),
    designation: z
      .string('Designation is required')
      .min(2, 'Designation must be at least 2 characters long')
      .max(100, 'Designation must be less than 100 characters long'),
  }),
  specialties: z
    .array(z.uuid('Specialty ID must be a valid UUID'))
    .min(1, 'At least one specialty is required'),
});
