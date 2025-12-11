import express, { Router } from "express";

import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "../controllers/productController";

const productRouter: Router = express.Router();

productRouter.post("/", createProductController);
productRouter.put("/:id", updateProductController);
productRouter.delete("/:id", deleteProductController);
productRouter.get("/", getProductsController);
productRouter.get("/:id", getProductsController);

export default productRouter;
