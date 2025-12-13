import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/userRepostirory";
import { UserAlreadyExistsError } from "../errors/UserErrors";
import { InvalidCredentialsError } from "../errors/AuthErrors";
import { LoginDto, RegisterDto } from "../validation/authSchema";

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterDto) => {
  const existing = await UserRepository.findUserByEmail(email);
  if (existing) throw new UserAlreadyExistsError(email);

  const hash = await bcrypt.hash(password, 10);

  const user = await UserRepository.createUser(
    firstName,
    lastName,
    email,
    hash
  );

  return {
    id: user.id,
    email: user.email,
  };
};

export const login = async ({ email, password }: LoginDto) => {
  const user = await UserRepository.findUserByEmail(email);
  if (!user) throw new InvalidCredentialsError();

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new InvalidCredentialsError();

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};
