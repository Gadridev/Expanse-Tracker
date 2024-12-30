import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().nonempty("Category name is required"),
  type: z.string().nonempty("Category type is required"),
});
const transactionSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  description: z.string().nonempty("Description is required"),
  category: categorySchema, 
  status: z.string().nonempty("Status is required"),
  amount: z.number().positive("Amount must be positive"),
});

export { transactionSchema };