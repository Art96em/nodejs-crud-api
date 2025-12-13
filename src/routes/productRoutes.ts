import express, { Router } from "express";

import { auth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/admin";
import { uuidParamSchema } from "../validation/generalSchema";
import { bodyValidation, paramsValidation } from "../middlewares/validation";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/productSchema";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "../controllers/productController";

const productRouter: Router = express.Router();

productRouter.post(
  "/",
  auth,
  isAdmin,
  bodyValidation(createProductSchema),
  createProductController
);
productRouter.put(
  "/:id",
  auth,
  isAdmin,
  paramsValidation(uuidParamSchema),
  bodyValidation(updateProductSchema),
  updateProductController
);
productRouter.delete(
  "/:id",
  auth,
  isAdmin,
  paramsValidation(uuidParamSchema),
  deleteProductController
);
productRouter.get("/", getProductsController);
productRouter.get(
  "/:id",
  paramsValidation(uuidParamSchema),
  getProductController
);

export default productRouter;
