import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { TokenPayload } from "../types/TokenTypes";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies["auth-token"];

  if (!token) return res.status(401).json({ message: "No token" });

  // const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.user = payload;

    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
}
