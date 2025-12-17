import { prisma } from "../../prisma";
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
  const item = await CartRepository.removeItem(userId, itemId);

  if (item.count === 0) {
    throw new CartItemNotFoundError(itemId);
  }

  return;
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
  return prisma.$transaction(async (tx) => {
    const item = await CartRepository.getItemByItemIdTx(tx, userId, itemId);

    if (!item) {
      throw new CartItemNotFoundError(itemId);
    }

    const product = await ProductRepository.getProductByIdTx(
      tx,
      item.product_id
    );

    if (!product) {
      throw new ProductNotFoundError(item.product_id);
    }

    if (product.quantity < quantity) {
      throw new NotEnoughStockError(product.id);
    }

    return CartRepository.changeQuantityTx(tx, userId, itemId, quantity);
  });
};
