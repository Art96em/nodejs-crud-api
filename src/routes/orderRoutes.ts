import express, { Router } from "express";
import {
  placeOrderController,
  getOrdersController,
  updateOrderController,
  getOrderController,
} from "../controllers/orderController";

const orderRouter: Router = express.Router();

orderRouter.post("/", placeOrderController);
orderRouter.get("/", getOrdersController);
orderRouter.put("/:id", updateOrderController);
orderRouter.get("/:id", getOrderController)

export default orderRouter;
