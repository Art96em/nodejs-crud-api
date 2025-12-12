import { prisma } from "../../prisma";
import { pool } from "../utils/db";

export class UserRepository {
  static findUserByEmail = (email: string) => {
    return prisma.users.findUnique({
      where: { email },
    });
  };

  static createUser = (
    firstName: string,
    lastName: string,
    email: string,
    hash: string,
    role: string = "user"
  ) => {
    return prisma.users.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        password_hash: hash,
        role,
      },
    });
  };
}
