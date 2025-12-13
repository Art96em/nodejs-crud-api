import { AppError } from "./AppError";

export class ProductNotFoundError extends AppError {
  constructor(productId?: string) {
    super(
      productId ? `Product ${productId} not found` : "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }
}

export class NotEnoughStockError extends AppError {
  constructor(productId: string) {
    super(`Not enough stock for product ${productId}`, 409, "NOT_ENOUGH_STOCK");
  }
}
