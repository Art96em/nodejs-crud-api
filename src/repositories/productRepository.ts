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
}
