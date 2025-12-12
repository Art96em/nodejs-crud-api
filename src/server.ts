import express, { Application, Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRouter from "./routes/authRoutes";
import cartRouter from "./routes/cartRoutes";
import productRouter from "./routes/productRoutes";
import { auth } from "./middlewares/auth";
import orderRouter from "./routes/orderRoutes";

const app: Application = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", auth, cartRouter);
app.use("/orders", auth, orderRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
