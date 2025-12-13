import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRouter from "./routes/authRoutes";
import cartRouter from "./routes/cartRoutes";
import orderRouter from "./routes/orderRoutes";
import productRouter from "./routes/productRoutes";
import { auth } from "./middlewares/auth";
import { errorMiddleware } from "./middlewares/error";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", auth, cartRouter);
app.use("/orders", auth, orderRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorMiddleware);
