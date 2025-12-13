import { ZodError } from "zod";

import { AppError } from "./AppError";

export class ValidationError extends AppError {
  public readonly fields: Record<string, string>;

  constructor(error: ZodError) {
    const fields: Record<string, string> = {};

    error.issues.forEach((e) => {
      fields[e.path.join(".")] = e.message;
    });

    super("Validation failed", 400, "VALIDATION_ERROR");
    this.fields = fields;
  }
}
