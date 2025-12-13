import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middlewares/auth";
import {
  getOrder,
  getOrderItems,
  getOrders,
  placeOrder,
  updateOrderStatus,
} from "../services/orderService";
import { OrderNotFoundError } from "../errors/OrderErrors";
import { ForbiddenError } from "../errors/AuthErrors";

export const getOrdersController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;
  const orders = await getOrders(userId);
  res.json(orders);
};

export const placeOrderController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;

  const order = await placeOrder(userId);
  res.json(order);
};

export const updateOrderController = async (req: Request, res: Response) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const cartItem = await updateOrderStatus(orderId, status);
  res.json(cartItem);
};

export const getOrderController = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;

  const userId = user.id;
  const orderId = req.params.id;

  const order = await getOrder(orderId);

  if (!order) {
    throw new OrderNotFoundError(orderId);
  }

  if (order.user_id !== userId) {
    throw new ForbiddenError();
  }

  const items = await getOrderItems(orderId);

  return res.json({ order, items });
};
