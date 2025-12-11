import { Request, Response } from "express";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

export const getProductsController = async (req: Request, res: Response) => {
  const products = await getProducts();
  res.json(products);
};

export const getProductController = async (req: Request, res: Response) => {
  const product = await getProduct(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

export const createProductController = async (req: Request, res: Response) => {
  const newProduct = await createProduct(req.body);
  res.status(201).json(newProduct);
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(404).json({ message: "Not found" });
  }
};
