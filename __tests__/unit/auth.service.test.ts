import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../../src/repositories/userRepostirory";
import { login, register } from "../../src/services/authService";
import { InvalidCredentialsError } from "../../src/errors/AuthErrors";
import { UserType} from "../../src/types/prisma/AuthTypes";
import { UserAlreadyExistsError } from "../../src/errors/UserErrors";

jest.mock("../../src/repositories/userRepostirory");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const id = 1;
const email = "test@gmail.com";
const password = "password";
const hashPassword = "hash_pass";
const token = "token";
const firstName = "Test";
const lastName = "Test";
const existingUser: UserType = {
  password_hash: hashPassword,
  id,
  email,
  role: "user",
  first_name: firstName,
  last_name: lastName,
  created_at: null,
  updated_at: null,
};

describe("login - service", () => {
  it("InvalidCredentialsError - email", async () => {
    (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(login({ email, password })).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );
  });

  it("InvalidCredentialsError - incorrect password", async () => {
    (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(
      existingUser
    );

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(login({ email, password })).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );
  });

  it("success", async () => {
    (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(
      existingUser
    );

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwt.sign as jest.Mock).mockReturnValue(token);

    const result = await login({ email, password });

    expect(result).toMatchObject({ token, user: { id, email } });
  });
});

describe("register - service", () => {
  it("UserAlreadyExistsError", async () => {
    (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(
      existingUser
    );

    await expect(
      register({ firstName, lastName, email, password })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("success", async () => {
    (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashPassword);

    (UserRepository.createUser as jest.Mock).mockResolvedValue(existingUser);

    const result = await register({ firstName, lastName, email, password });

    expect(result).toMatchObject({ id, email });
  });
});
