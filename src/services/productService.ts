import { ProductNotFoundError } from "../errors/ProductErrors";
import { ProductRepository } from "../repositories/productRepository";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "../validation/productSchema";

export const createProduct = (product: CreateProductDTO) => {
  return ProductRepository.createProduct(product);
};

export const deleteProduct = (productId: string) => {
  const existing = ProductRepository.getProductById(productId);

  if (!existing) {
    throw new ProductNotFoundError(productId);
  }

  return ProductRepository.deleteProduct(productId);
};

export const updateProduct = (productId: string, product: UpdateProductDTO) => {
  const existing = ProductRepository.getProductById(productId);

  if (!existing) {
    throw new ProductNotFoundError(productId);
  }

  return ProductRepository.updateProduct(productId, product);
};

export const getProducts = () => {
  return ProductRepository.getAllProducts();
};

export const getProduct = (productId: string) => {
  return ProductRepository.getProductById(productId);
};
