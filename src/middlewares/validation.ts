import { ZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors/ValidationErrors";

export const bodyValidation =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(err);
      }
      throw err;
    }
  };

export const paramsValidation =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      res.locals.params = parsed;
      next();
    } catch (e) {
      next(new ValidationError(e as ZodError));
    }
  };
