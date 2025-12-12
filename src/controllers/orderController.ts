import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middlewares/auth";
import {
  getOrders,
  placeOrder,
  updateOrderStatus,
} from "../services/orderService";

export const getOrdersController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;
  const orders = await getOrders(userId);
  res.json(orders);
};

export const placeOrderController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;

  try {
    const order = await placeOrder(userId);
    res.json(order);
  } catch (e: any) {
    res.status(400).json({ message: e.message }); // TODO make custome errors
  }
};

export const updateOrderController = async (req: Request, res: Response) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    const cartItem = await updateOrderStatus(orderId, status);
    res.json(cartItem);
  } catch (e: any) {
    res.status(400).json({ message: e.message }); // TODO make custome errors
  }
};
