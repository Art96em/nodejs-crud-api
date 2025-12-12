import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { Decimal } from "@prisma/client/runtime/client";

export class OrderRepository {
  static async placeOrderTx(
    tx: Prisma.TransactionClient,
    userId: number,
    totalPrice: Decimal
  ) {
    return tx.orders.create({
      data: { user_id: userId, total_price: totalPrice, status: "CREATED" },
    });
  }

  static async placeOrder(userId: number, totalPrice: Decimal) {
    return prisma.orders.create({
      data: { user_id: userId, total_price: totalPrice, status: "CREATED" },
    });
  }

  static async updateOrderStatus(orderId: string, status: string) {
    return prisma.orders.update({
      where: { id: orderId },
      data: { status },
    });
  }

  static async getAllOrdersByUserId(userId: number) {
    return prisma.orders.findMany({ where: { user_id: userId } });
  }

  static async getOrderById(orderId: string) {
    return prisma.orders.findUnique({ where: { id: orderId } });
  }
}
