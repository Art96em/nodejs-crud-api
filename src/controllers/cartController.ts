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
  const { productId, quantity } = req.body;

  try {
    const productItem = await addItem(userId, productId, quantity);
    res.json(productItem);
  } catch (e: any) {
    res.status(400).json({ message: e.message }); // TODO make custom errors
  }
};

export const deleteCartItemController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const itemId = req.params.id;
  const userId = user.id;

  try {
    await deleteCartItem(userId, itemId);
    res.json({ message: "Item removed" });
  } catch (e: any) {
    res.status(400).json({ message: e.message }); // TODO make custome errors
  }
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
  const { quantity } = req.body;
  const itemId = req.params.id;

  try {
    const cartItem = await updateCartItem(userId, itemId, quantity);
    res.json(cartItem);
  } catch (e: any) {
    res.status(400).json({ message: e.message }); // TODO make custome errors
  }
};
