import express, { Application, Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/authRoutes";
import productRouter from "./routes/productRoutes";

const app: Application = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
