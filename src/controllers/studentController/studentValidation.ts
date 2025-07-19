import { z } from 'zod';

// const createStudentValidation = z.object({
//   body: z.object({
//     email: z
//       .string({ required_error: 'Email is required' })
//       .email('Invalid email format'),
//     password: z
//       .string({ required_error: 'Password is required' })
//       .min(8, 'Password must be at least 8 characters long'),
//   }),
// });


export const createStudentValidation = z.object({
  body: z.object({
    studentId: z.string({ required_error: 'Student ID is required' }),
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    religion: z.string().optional(),
    schoolName: z.string().optional(),
    phone: z.string({ required_error: 'Phone number is required' }),
    admissionFees: z.number().int().optional(),
    address: z.string().optional(),
    image: z.string().optional(),
    gender: z.string().optional(),
    batchName: z.string().optional(), // Will be set by backend
    className: z.string().optional(),
    shiftName: z.string().optional(),
    classId: z.string().optional(),
    batchId: z.string().optional(),
    shiftId: z.string().optional(),
  }),
});


