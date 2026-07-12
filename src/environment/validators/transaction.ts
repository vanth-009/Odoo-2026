import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  timestamp: z.coerce.date().default(() => new Date()),
  departmentId: z.string().min(1, 'Please select a department'),
  source: z.enum(['Purchase', 'Manufacturing', 'Fleet', 'Electricity', 'Business Travel', 'Waste Management', 'Manual Entry']),
  productId: z.string().optional().nullable(),
  product: z.string().min(1, 'Product name is required'),
  operation: z.string().min(3, 'Operational activity must be at least 3 characters'),
  emissionFactorId: z.string().min(1, 'Emission factor is required'),
  quantity: z.coerce.number().gt(0, 'Quantity must be greater than zero'),
  notes: z.string().optional().nullable(),
  status: z.enum(['Draft', 'Calculated', 'Verified', 'Archived']).default('Verified'),
  createdBy: z.string().default('System')
});

export const UpdateTransactionSchema = z.object({
  timestamp: z.coerce.date().optional(),
  departmentId: z.string().min(1, 'Please select a department').optional(),
  source: z.enum(['Purchase', 'Manufacturing', 'Fleet', 'Electricity', 'Business Travel', 'Waste Management', 'Manual Entry']).optional(),
  productId: z.string().optional().nullable(),
  product: z.string().min(1, 'Product name is required').optional(),
  operation: z.string().min(3, 'Operational activity must be at least 3 characters').optional(),
  emissionFactorId: z.string().min(1, 'Emission factor is required').optional(),
  quantity: z.coerce.number().gt(0, 'Quantity must be greater than zero').optional(),
  notes: z.string().optional().nullable(),
  status: z.enum(['Draft', 'Calculated', 'Verified', 'Archived']).optional(),
  createdBy: z.string().optional()
});
