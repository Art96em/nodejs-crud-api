import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";

export class CartRepository {
  static async putItem(userId: number, productId: string, quantity: number) {
    return prisma.cart_items.create({
      data: { product_id: productId, quantity, user_id: userId },
    });
  }

  static async removeItem(userId: number, itemId: string) {
    return prisma.cart_items.deleteMany({
      where: { id: itemId, user_id: userId },
    });
  }

  static async clearCart(userId: number) {
    return prisma.cart_items.deleteMany({
      where: { user_id: userId },
    });
  }

  static async clearCartTx(tx: Prisma.TransactionClient, userId: number) {
    return tx.cart_items.deleteMany({
      where: { user_id: userId },
    });
  }

  static async getItems(userId: number) {
    return prisma.cart_items.findMany({
      where: { user_id: userId },
    });
  }

  static async getItemByItemId(userId: number, itemId: string) {
    return prisma.cart_items.findFirst({
      where: { user_id: userId, id: itemId },
    });
  }

  static async getItemByProductId(userId: number, productId: string) {
    return prisma.cart_items.findFirst({
      where: { user_id: userId, product_id: productId },
    });
  }

  static async changeQuantity(
    userId: number,
    itemId: string,
    quantity: number
  ) {
    return prisma.cart_items.update({
      where: { id: itemId, user_id: userId },
      data: { quantity },
    });
  }
}
