import express, { Router } from "express";

import { auth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/admin";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "../controllers/productController";

const productRouter: Router = express.Router();

productRouter.post("/", auth, isAdmin, createProductController);
productRouter.put("/:id", auth, isAdmin, updateProductController);
productRouter.delete("/:id", auth, isAdmin, deleteProductController);
productRouter.get("/", getProductsController);
productRouter.get("/:id", getProductController);

export default productRouter;
