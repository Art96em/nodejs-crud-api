import request from "supertest";

import { app } from "../src/app";
import * as authService from "../src/services/authService";
import { InvalidCredentialsError } from "../src/errors/AuthErrors";

jest.mock("../src/services/authService");

const id = 1;
const email = "test@gmail.com";
const password = "password";

describe("POST /auth", () => {
  it("Success", async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      token: "123",
      user: { id, email },
    });

    const res = await request(app)
      .post(`/auth/login`)
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id, email });
  });

  it("404 if item not found", async () => {
    (authService.login as jest.Mock).mockRejectedValue(
      new InvalidCredentialsError()
    );

    const res = await request(app)
      .post(`/auth/login`)
      .send({ email, password });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });
});
