import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(1, 'Product code / SKU is required'),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  packagingType: z.string().min(1, 'Packaging type is required'),
  recyclablePercent: z.coerce.number()
    .min(0, 'Recyclable percentage must be at least 0%')
    .max(100, 'Recyclable percentage cannot exceed 100%'),
  manufacturingCountry: z.string().min(1, 'Manufacturing country is required'),
  lifecycleStage: z.string().min(1, 'Lifecycle stage is required'),
  hazardClass: z.string().optional().nullable(),
  carbonCategory: z.string().optional().nullable(),
  preferredEmissionFactorId: z.string().optional().nullable(),
  esgRating: z.string().min(1, 'ESG Rating is required'),
  description: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE')
});

export const UpdateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  code: z.string().min(1, 'Product code / SKU is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  supplier: z.string().min(1, 'Supplier is required').optional(),
  packagingType: z.string().min(1, 'Packaging type is required').optional(),
  recyclablePercent: z.coerce.number()
    .min(0, 'Recyclable percentage must be at least 0%')
    .max(100, 'Recyclable percentage cannot exceed 100%').optional(),
  manufacturingCountry: z.string().min(1, 'Manufacturing country is required').optional(),
  lifecycleStage: z.string().min(1, 'Lifecycle stage is required').optional(),
  hazardClass: z.string().optional().nullable(),
  carbonCategory: z.string().optional().nullable(),
  preferredEmissionFactorId: z.string().optional().nullable(),
  esgRating: z.string().min(1, 'ESG Rating is required').optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional()
});
