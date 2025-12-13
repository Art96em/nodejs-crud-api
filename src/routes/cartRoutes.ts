import express, { Router } from "express";

import {
  addCartItemController,
  clearCartController,
  deleteCartItemController,
  getCartController,
  updateCartItemController,
} from "../controllers/cartController";
import {
  addCartItemSchema,
  updateCartItemSchema,
} from "../validation/cartSchema";
import { bodyValidation, paramsValidation } from "../middlewares/validation";
import { uuidParamSchema } from "../validation/generalSchema";

const cartRouter: Router = express.Router();

cartRouter.post("/", bodyValidation(addCartItemSchema), addCartItemController);
cartRouter.delete("/", clearCartController);
cartRouter.put(
  "/:id",
  paramsValidation(uuidParamSchema),
  bodyValidation(updateCartItemSchema),
  updateCartItemController
);
cartRouter.delete(
  "/:id",
  paramsValidation(uuidParamSchema),
  deleteCartItemController
);
cartRouter.get("/", getCartController);

export default cartRouter;
