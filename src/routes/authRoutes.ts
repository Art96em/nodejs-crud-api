import express, { Router } from "express";

import { login, register } from "../controllers/authController";

const authRouter: Router = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);

export default authRouter;
