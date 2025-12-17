import { Prisma } from "@prisma/client";

import { prisma } from "../../prisma";
import {
  CreateProductType,
  UpdateProductType,
} from "../validation/productSchema";

export class ProductRepository {
  static async createProduct(data: CreateProductType) {
    return prisma.products.create({
      data,
    });
  }

  static async deleteProduct(productId: string) {
    return prisma.products.deleteMany({
      where: { id: productId },
    });
  }

  static async getAllProducts() {
    return prisma.products.findMany();
  }

  static async updateProduct(productId: string, data: UpdateProductType) {
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
