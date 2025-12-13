import { CartItemNotFoundError } from "../errors/CartErrors";
import {
  NotEnoughStockError,
  ProductNotFoundError,
} from "../errors/ProductErrors";
import { CartRepository } from "../repositories/cartRepository";
import { ProductRepository } from "../repositories/productRepository";
import { AddCartItemDto, UpdateCartItemDto } from "../validation/cartSchema";

export const addItem = async (
  userId: number,
  { productId, quantity }: AddCartItemDto
) => {
  const product = await ProductRepository.getProductById(productId);

  if (!product) {
    throw new ProductNotFoundError(productId);
  }

  if (product.quantity < quantity) {
    throw new NotEnoughStockError(productId);
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

export const deleteCartItem = async (userId: number, itemId: string) => {
  const item = await CartRepository.getItemByItemId(userId, itemId);

  if (!item) {
    throw new CartItemNotFoundError(itemId);
  }

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
  { quantity }: UpdateCartItemDto
) => {
  const item = await CartRepository.getItemByItemId(userId, itemId);

  if (!item) {
    throw new CartItemNotFoundError(itemId);
  }

  const productId = item.product_id;

  const existingProduct = await ProductRepository.getProductById(productId);

  if (!existingProduct) {
    throw new ProductNotFoundError(productId);
  }

  if (existingProduct.quantity < quantity) {
    throw new NotEnoughStockError(productId);
  }

  return CartRepository.changeQuantity(userId, itemId, quantity);
};
