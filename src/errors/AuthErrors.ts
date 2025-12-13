import { AppError } from "./AppError";

export class AuthTokenMissingError extends AppError {
  constructor() {
    super("Authentication token is missing", 401, "AUTH_TOKEN_MISSING");
  }
}

export class AuthTokenInvalidError extends AppError {
  constructor() {
    super("Authentication token is invalid", 401, "AUTH_TOKEN_INVALID");
  }
}

export class AuthTokenExpiredError extends AppError {
  constructor() {
    super("Authentication token has expired", 401, "AUTH_TOKEN_EXPIRED");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }
}

export class NotAuthenticatedError extends AppError {
  constructor() {
    super("Not authenticated", 401, "NOT_AUTHENTICATED");
  }
}

export class ForbiddenError extends AppError {
  constructor(reason?: string) {
    super(reason ?? "Access forbidden", 403, "FORBIDDEN");
  }
}
