import express, { Router } from "express";

import {
  addCartItemController,
  clearCartController,
  deleteCartItemController,
  getCartController,
  updateCartItemController,
} from "../controllers/cartController";

const cartRouter: Router = express.Router();

cartRouter.post("/", addCartItemController);
cartRouter.delete("/", clearCartController);
cartRouter.put("/:id", updateCartItemController);
cartRouter.delete("/:id", deleteCartItemController);
cartRouter.get("/", getCartController);

export default cartRouter;
