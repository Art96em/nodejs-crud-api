import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middlewares/auth";
import {
  getOrder,
  getOrderItems,
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

export const getOrderController = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const userId = user.id;
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const order = await getOrder(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.user_id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const items = await getOrderItems(orderId);

    return res.json({ order, items });
  } catch (e: any) {
    res.status(400).json({ message: e.message }); // TODO make custome errors
  }
};
