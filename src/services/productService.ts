import { ProductInputType } from "../models/ProductTypes";
import { ProductRepository } from "../repositories/productRepository";

export const createProduct = (product: ProductInputType) => {
  return ProductRepository.createProduct(product);
};

export const deleteProduct = (productId: string) => {
  return ProductRepository.deleteProduct(productId);
};

export const updateProduct = (productId: string, product: ProductInputType) => {
  return ProductRepository.updateProduct(productId, product);
};

export const getProducts = () => {
  return ProductRepository.getAllProducts();
};

export const getProduct = (productId: string) => {
  return ProductRepository.getProductById(productId);
};
