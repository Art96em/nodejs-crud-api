import bcrypt from "bcrypt";

import { UserRepository } from "../src/repositories/userRepostirory";
import { login } from "../src/services/authService";
import { InvalidCredentialsError } from "../src/errors/AuthErrors";

jest.mock("../src/repositories/userRepostirory");

const email = "test@gmail.com";
const password = "password";

describe("login - service", () => {
  it("InvalidCredentialsError - email", async () => {
    (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(login({ email, password })).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );

    // expect(bcrypt.compare).toHaveBeenCalledTimes(0);
  });
});
