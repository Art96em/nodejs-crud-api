import express, { Router } from "express";
import {
  placeOrderController,
  getOrdersController,
  updateOrderController,
  getOrderController,
} from "../controllers/orderController";
import { paramsValidation } from "../middlewares/validation";
import { uuidParamSchema } from "../validation/generalSchema";

const orderRouter: Router = express.Router();

orderRouter.post("/", placeOrderController);
orderRouter.get("/", getOrdersController);
orderRouter.put(
  "/:id",
  paramsValidation(uuidParamSchema),
  updateOrderController
);
orderRouter.get("/:id", paramsValidation(uuidParamSchema), getOrderController);

export default orderRouter;
