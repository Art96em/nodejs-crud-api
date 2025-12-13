import { AppError } from "./AppError";

export class CartEmptyError extends AppError {
  constructor() {
    super("Your cart is empty", 400, "CART_EMPTY");
  }
}

export class CartItemNotFoundError extends AppError {
  constructor(itemId: string) {
    super(`Cart item ${itemId} not found`, 404, "CART_ITEM_NOT_FOUND");
  }
}
