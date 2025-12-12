import { CartRepository } from "../repositories/cartRepository";
import { ProductRepository } from "../repositories/productRepository";

export const addItem = async (
  userId: number,
  productId: string,
  quantity: number
) => {
  const product = await ProductRepository.getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  if (product.quantity < quantity) {
    throw new Error("Not enough product quantity in stock");
  }

  const existing = await CartRepository.getItemByProductId(userId, productId);

  if (existing) {
    return CartRepository.changeQuantity(
      userId,
      existing.id,
      existing.quantity + quantity
    );
  }

  return CartRepository.putItem(userId, productId, quantity);
};

export const deleteCartItem = (userId: number, itemId: string) => {
  return CartRepository.removeItem(userId, itemId);
};

export const clearCart = (userId: number) => {
  return CartRepository.clearCart(userId);
};

export const getCartItems = (userId: number) => {
  return CartRepository.getItems(userId);
};

export const updateCartItem = async (
  userId: number,
  itemId: string,
  quantity: number
) => {
  const item = await CartRepository.getItemByItemId(userId, itemId);

  if (!item) {
    throw new Error("Item not found");
  }

  const existingProduct = await ProductRepository.getProductById(
    item.product_id
  );

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  if (existingProduct.quantity < quantity) {
    throw new Error("Not enough product quantity in stock");
  }

  return CartRepository.changeQuantity(userId, itemId, quantity);
};
