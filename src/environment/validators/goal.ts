import { z } from 'zod';

export const CreateGoalSchema = z.object({
  name: z.string().min(3, 'Goal name must be at least 3 characters'),
  description: z.string().optional().nullable(),
  departmentId: z.string().min(1, 'Please select a department'),
  category: z.string().min(1, 'Please select a goal category'),
  baselineCarbon: z.coerce.number().positive('Baseline carbon emissions must be greater than zero'),
  targetCarbon: z.coerce.number().positive('Target carbon emissions must be greater than zero'),
  startDate: z.coerce.date(),
  targetDate: z.coerce.date(),
  owner: z.string().min(2, 'Owner name must be at least 2 characters'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  status: z.enum(['Draft', 'Active', 'On Track', 'At Risk', 'Completed', 'Archived']).default('Active')
}).refine(data => data.targetCarbon < data.baselineCarbon, {
  message: 'Target emissions must always be lower than baseline emissions',
  path: ['targetCarbon']
}).refine(data => data.startDate < data.targetDate, {
  message: 'Start Date must be earlier than Target Date',
  path: ['targetDate']
});

export const UpdateGoalSchema = z.object({
  name: z.string().min(3, 'Goal name must be at least 3 characters').optional(),
  description: z.string().optional().nullable(),
  departmentId: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  baselineCarbon: z.coerce.number().positive().optional(),
  targetCarbon: z.coerce.number().positive().optional(),
  startDate: z.coerce.date().optional(),
  targetDate: z.coerce.date().optional(),
  owner: z.string().min(2).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Draft', 'Active', 'On Track', 'At Risk', 'Completed', 'Archived']).optional()
}).refine(data => {
  if (data.baselineCarbon !== undefined && data.targetCarbon !== undefined) {
    return data.targetCarbon < data.baselineCarbon;
  }
  return true;
}, {
  message: 'Target emissions must always be lower than baseline emissions',
  path: ['targetCarbon']
}).refine(data => {
  if (data.startDate !== undefined && data.targetDate !== undefined) {
    return data.startDate < data.targetDate;
  }
  return true;
}, {
  message: 'Start Date must be earlier than Target Date',
  path: ['targetDate']
});
