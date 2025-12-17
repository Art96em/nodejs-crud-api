import request from "supertest";

import { app } from "../../src/app";
import * as authService from "../../src/services/authService";
import { InvalidCredentialsError } from "../../src/errors/AuthErrors";
import { UserType } from "../../src/types/prisma/AuthTypes";
import { UserAlreadyExistsError } from "../../src/errors/UserErrors";

jest.mock("../../src/services/authService");

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

describe("POST /auth/login", () => {
  it("200", async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      token,
      user: { id, email },
    });

    const res = await request(app)
      .post(`/auth/login`)
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id, email });
  });

  it("401 - invalid credentials", async () => {
    (authService.login as jest.Mock).mockRejectedValue(
      new InvalidCredentialsError()
    );

    const res = await request(app)
      .post(`/auth/login`)
      .send({ email, password });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("400 - VALIDATION_ERROR", async () => {
    const res = await request(app).post(`/auth/login`).send({ email });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("POST /auth/register", () => {
  it("200", async () => {
    (authService.register as jest.Mock).mockResolvedValue({ id, email });

    const res = await request(app)
      .post(`/auth/register`)
      .send({ firstName, lastName, email, password });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id, email });
  });

  it("409 - user exists", async () => {
    (authService.register as jest.Mock).mockRejectedValue(
      new UserAlreadyExistsError()
    );

    const res = await request(app)
      .post(`/auth/register`)
      .send({ firstName, lastName, email, password });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("USER_ALREADY_EXISTS");
  });

  it("400 - VALIDATION_ERROR", async () => {
    const res = await request(app)
      .post(`/auth/register`)
      .send({ firstName, email, password });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
