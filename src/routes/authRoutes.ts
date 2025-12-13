import express, { Router } from "express";

import {
  loginController,
  registerController,
} from "../controllers/authController";
import { bodyValidation } from "../middlewares/validation";
import { loginSchema, registerSchema } from "../validation/authSchema";

const authRouter: Router = express.Router();

authRouter.post("/login", bodyValidation(loginSchema), loginController);
authRouter.post("/register", bodyValidation(registerSchema), registerController);

export default authRouter;
