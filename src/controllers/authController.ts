import { Request, Response } from "express";

import { login, register } from "../services/authService";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.cookie("auth-token", result.token);
    res.json(result.user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await register(firstName, lastName, email, password);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
