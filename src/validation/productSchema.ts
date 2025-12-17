import { z } from "zod";

const quantity = z.number().int().min(1, "Quantity should be greater than 1");

const baseProductSchema = {
  name: z.string().trim().min(10).max(50),
  description: z.string().trim().min(10).max(250),
  price: z.number().min(0.1),
  quantity,
};

export const createProductSchema = z.object(baseProductSchema);
export const updateProductSchema = z
  .object(baseProductSchema)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateProductType = z.infer<typeof createProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;
