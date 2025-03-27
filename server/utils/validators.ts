import { z } from 'zod';

// User registration validation schema
export const registerUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  emergencyName: z.string().min(2, 'Emergency contact name must be at least 2 characters'),
  emergencyContact: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid emergency phone number format'),
  touchId: z.string().min(10, 'Touch ID data is invalid')
});

// Profile update validation schema
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  emergencyName: z.string().min(2, 'Emergency contact name must be at least 2 characters'),
  emergencyContact: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid emergency phone number format')});
