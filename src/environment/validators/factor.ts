import { z } from 'zod';

export const CreateFactorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional().nullable(),
  unit: z.string().min(1, 'Unit is required'),
  value: z.coerce.number().positive('CO2 factor must be greater than 0'),
  source: z.string().min(1, 'Source is required'),
  version: z.string().min(1, 'Version is required'),
  effectiveDate: z.coerce.date().default(() => new Date()),
  description: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE')
});

export const UpdateFactorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  subcategory: z.string().optional().nullable(),
  unit: z.string().min(1, 'Unit is required').optional(),
  value: z.coerce.number().positive('CO2 factor must be greater than 0').optional(),
  source: z.string().min(1, 'Source is required').optional(),
  version: z.string().min(1, 'Version is required').optional(),
  effectiveDate: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional()
});
