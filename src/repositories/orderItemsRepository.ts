import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { Decimal } from "@prisma/client/runtime/client";

export class OrderItemsRepository {
  static async addOrderItem(
    orderId: string,
    productId: string,
    quantity: number,
    price: number
  ) {
    return prisma.order_items.create({
      data: { order_id: orderId, product_id: productId, price, quantity },
    });
  }

  static async addManyOrderItems(
    orderId: string,
    items: { productId: string; quantity: number; price: Decimal }[]
  ) {
    return prisma.order_items.createMany({
      data: items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  static async addManyOrderItemsTx(
    tx: Prisma.TransactionClient,
    orderId: string,
    items: { productId: string; quantity: number; price: Decimal }[]
  ) {
    return tx.order_items.createMany({
      data: items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  static async getAllOrderItemsByOrderId(orderId: string) {
    return prisma.order_items.findMany({ where: { order_id: orderId } });
  }
}
