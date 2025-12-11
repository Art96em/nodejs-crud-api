import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createUser, findUserByEmail } from "../repositories/authRepostirory";

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);

  const user = await createUser(firstName, lastName, email, hash);

  return {
    id: user.id,
    email: user.email,
  };
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};
