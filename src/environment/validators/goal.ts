import { z } from 'zod';

export const CreateGoalSchema = z.object({
  name: z.string().min(3, 'Goal name must be at least 3 characters'),
  departmentId: z.string().min(1, 'Please select a department'),
  owner: z.string().min(2, 'Owner name must be at least 2 characters'),
  target: z.coerce.number().positive('Target carbon savings must be greater than 0'),
  deadline: z.string().min(1, 'Please select a valid deadline date')
});
