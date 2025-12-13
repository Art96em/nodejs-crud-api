import { AppError } from "./AppError";

export class UserAlreadyExistsError extends AppError {
  constructor(email?: string) {
    super(
      email ? `User with email ${email} already exists` : "User already exists",
      409,
      "USER_ALREADY_EXISTS"
    );
  }
}
