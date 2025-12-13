import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { TokenPayload } from "../types/TokenTypes";
import {
  AuthTokenMissingError,
  AuthTokenInvalidError,
  AuthTokenExpiredError,
} from "../errors/AuthErrors";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies["auth-token"];

  if (!token) {
    throw new AuthTokenMissingError();
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AuthTokenExpiredError();
    }

    throw new AuthTokenInvalidError();
  }
}
