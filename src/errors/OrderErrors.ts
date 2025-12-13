import { AppError } from "./AppError";

export class OrderNotFoundError extends AppError {
  constructor(orderId?: string) {
    super(
      orderId ? `Order ${orderId} not found` : "Order not found",
      404,
      "ORDER_NOT_FOUND"
    );
  }
}
