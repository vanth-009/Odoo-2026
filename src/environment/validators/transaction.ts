import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  departmentId: z.string().min(1, 'Please select a department'),
  operation: z.string().min(3, 'Operation name must be at least 3 characters'),
  product: z.string().min(2, 'Product/Source must be at least 2 characters'),
  carbon: z.coerce.number().positive('Carbon generated must be greater than 0 tCO2e')
});
