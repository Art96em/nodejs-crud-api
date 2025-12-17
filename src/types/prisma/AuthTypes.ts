import { UserRepository } from "../../repositories/userRepostirory";

export type MaybeUserType = Awaited<
  ReturnType<typeof UserRepository.findUserByEmail>
>;

export type UserType = Awaited<ReturnType<typeof UserRepository.createUser>>;
