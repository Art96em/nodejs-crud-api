import { Decimal } from "@prisma/client/runtime/client";

import { CartRepository } from "../repositories/cartRepository";
import { OrderRepository } from "../repositories/orderRepository";
import { ProductRepository } from "../repositories/productRepository";
import { OrderItemsRepository } from "../repositories/orderItemsRepository";
import { prisma } from "../../prisma";

export const placeOrder = async (userId: number) => {
  const items = await CartRepository.getItems(userId);

  if (!items.length) {
    throw new Error("Your cart is empty");
  }

  const products = await Promise.all(
    items.map((i) => ProductRepository.getProductById(i.product_id))
  );

  products.forEach((p) => {
    if (!p) {
      throw new Error("Product not found");
    }
  });

  let totalPrice = new Decimal(0);

  items.forEach((item, index) => {
    const product = products[index]!;
    const lineTotal = product.price.mul(item.quantity);
    totalPrice = totalPrice.add(lineTotal);
  });

  const result = await prisma.$transaction(async (tx) => {
    const order = await OrderRepository.placeOrderTx(tx, userId, totalPrice);

    const orderItemsData = items.map((item, index) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: products[index]!.price,
    }));

    for (let i = 0; i < items.length; i++) {
      const productId = items[i].product_id;
      const productQuantity = items[i].quantity;

      const product = await ProductRepository.getProductByIdTx(tx, productId);

      if (!product) throw new Error("Product not found");
      if (product.quantity < productQuantity)
        throw new Error("Not enough stock");

      await ProductRepository.decreaseStockTx(tx, productId, productQuantity);
    }

    await OrderItemsRepository.addManyOrderItemsTx(
      tx,
      order.id,
      orderItemsData
    );

    await CartRepository.clearCartTx(tx, userId);

    return order;
  });

  return result;
};

export const getOrders = (userId: number) => {
  return OrderRepository.getAllOrdersByUserId(userId);
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await OrderRepository.getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  return OrderRepository.updateOrderStatus(orderId, status);
};

export const getOrder = (orderId: string) => {
  return OrderRepository.getOrderById(orderId);
};

export const getOrderItems = (orderId: string) => {
  return OrderItemsRepository.getAllOrderItemsByOrderId(orderId);
};
