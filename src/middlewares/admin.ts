import { Response, NextFunction } from "express";

import { AuthRequest } from "./auth";
import { ForbiddenError, NotAuthenticatedError } from "../errors/AuthErrors";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new NotAuthenticatedError();
  }

  if (req.user.role !== "admin") {
    throw new ForbiddenError("Admin role required");
  }

  next();
};
