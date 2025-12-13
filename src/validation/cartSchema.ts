import { z } from "zod";

const uuid = z.uuid("Invalid format");
const quantity = z.number().min(1, "Quantity should be greater than 1");

export const addCartItemSchema = z.object({
  productId: uuid,
  quantity,
});

export const updateCartItemSchema = z.object({
  quantity,
});

export type AddCartItemDto = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
