import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { ProductUpdateType, ProductInputType } from "../types/ProductTypes";

export class ProductRepository {
  static async createProduct(data: ProductInputType) {
    return prisma.products.create({
      data,
    });
  }

  static async deleteProduct(productId: string) {
    return prisma.products.delete({
      where: { id: productId },
    });
  }

  static async getAllProducts() {
    return prisma.products.findMany();
  }

  static async updateProduct(productId: string, data: ProductUpdateType) {
    return prisma.products.update({
      where: { id: productId },
      data,
    });
  }

  static async getProductById(productId: string) {
    return prisma.products.findUnique({
      where: { id: productId },
    });
  }

  static async getProductByIdTx(
    tx: Prisma.TransactionClient,
    productId: string
  ) {
    return tx.products.findUnique({
      where: { id: productId },
    });
  }

  static async decreaseStockTx(
    tx: Prisma.TransactionClient,
    productId: string,
    quantity: number
  ) {
    return tx.products.update({
      where: { id: productId },
      data: { quantity: { decrement: quantity } },
    });
  }
}
