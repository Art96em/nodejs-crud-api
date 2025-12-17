import { Prisma } from "@prisma/client";

import { ProductNotFoundError } from "../errors/ProductErrors";
import { ProductRepository } from "../repositories/productRepository";
import {
  CreateProductType,
  UpdateProductType,
} from "../validation/productSchema";

export const createProduct = (product: CreateProductType) => {
  return ProductRepository.createProduct(product);
};

export const deleteProduct = async (productId: string) => {
  const { count } = await ProductRepository.deleteProduct(productId);

  if (count === 0) {
    throw new ProductNotFoundError(productId);
  }

  return;
};

export const updateProduct = async (
  productId: string,
  product: UpdateProductType
) => {
  try {
    return await ProductRepository.updateProduct(productId, product);
  } catch (e: any) {
    if (e?.code === "P2025") {
      throw new ProductNotFoundError(productId);
    }
    throw e;
  }
};

export const getProducts = () => {
  return ProductRepository.getAllProducts();
};

export const getProduct = (productId: string) => {
  return ProductRepository.getProductById(productId);
};
