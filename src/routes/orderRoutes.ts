import express, { Router } from "express";
import {
  placeOrderController,
  getOrdersController,
  updateOrderController,
} from "../controllers/orderController";

const orderRouter: Router = express.Router();

orderRouter.post("/", placeOrderController);
orderRouter.get("/", getOrdersController);
orderRouter.put("/:id", updateOrderController);

export default orderRouter;
