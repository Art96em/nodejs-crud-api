import { Request, Response } from "express";

import { login, register } from "../services/authService";

export const loginController = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await login(data);
  res.cookie("auth-token", result.token);
  res.json(result.user);
};

export const registerController = async (req: Request, res: Response) => {
  const data = req.body;

  const user = await register(data);
  res.json(user);
};
