import { Request, Response } from "express";

import {
  addItem,
  clearCart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "../services/cartService";
import { AuthenticatedRequest } from "../middlewares/auth";

export const addCartItemController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;
  const data = req.body;

  const productItem = await addItem(userId, data);
  res.json(productItem);
};

export const deleteCartItemController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const itemId = req.params.id;
  const userId = user.id;

  await deleteCartItem(userId, itemId);
  res.json({ message: "Item removed" });
};

export const clearCartController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;

  await clearCart(userId);
  res.json({ message: "Cart is cleared" });
};

export const getCartController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;

  const cart = await getCartItems(userId);
  res.json(cart);
};

export const updateCartItemController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;
  const data = req.body;
  const itemId = req.params.id;

  const cartItem = await updateCartItem(userId, itemId, data);
  res.json(cartItem);
};
