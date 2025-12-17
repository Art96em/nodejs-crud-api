import { ProductRepository } from "../../repositories/productRepository";

export type MaybeProductType = Awaited<
  ReturnType<typeof ProductRepository.getProductById>
>;

export type ProductType = Awaited<
  ReturnType<typeof ProductRepository.createProduct>
>;
