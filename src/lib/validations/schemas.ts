import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

const nameSchema = z
  .string()
  .min(3, 'Name must be at least 3 characters')
  .max(60, 'Name must be at most 60 characters');

const addressSchema = z
  .string()
  .max(400, 'Address must be at most 400 characters')
  .min(1, 'Address is required');

const emailSchema = z
  .string()
  .email('Invalid email format');

export const userRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['user', 'store_owner']).default('user'),
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const storeCreationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerEmail: emailSchema.optional(),
});

export const ratingSchema = z.object({
  storeId: z.number().positive('Store ID must be a positive number'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const adminUserCreationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['admin', 'user', 'store_owner']),
});

export const adminUserUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  address: addressSchema.optional(),
  role: z.enum(['admin', 'user', 'store_owner']).optional(),
}).refine(
  (data) => Object.values(data).some(value => value !== undefined),
  { message: 'At least one field must be provided for update' }
);