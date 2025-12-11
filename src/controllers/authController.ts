import { Request, Response } from "express";
import { loginService, registerService } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.cookie("auth-token", result.token);
    res.json(result.user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await registerService(firstName, lastName, email, password);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
