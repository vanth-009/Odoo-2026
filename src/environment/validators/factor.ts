import { z } from 'zod';

export const UpdateFactorSchema = z.object({
  id: z.string().min(1, 'Invalid factor ID'),
  value: z.coerce.number().positive('Emission factor value must be greater than 0')
});
