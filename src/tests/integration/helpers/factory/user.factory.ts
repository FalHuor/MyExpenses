import type { PrismaClient } from "../../../../../generated/prisma/client";
import { passwordService } from "../../../../app";

export async function createUser(
  prisma: PrismaClient,
  overrides?: {
    email?: string;
    username?: string;
    password?: string;
  },
) {
  let password = "hashed-password"
  if (overrides?.password) {
    password = await passwordService.hash(overrides.password);
  }

  return await prisma.user.create({
    data: {
      email: overrides?.email ?? "john.doe@test.fr",
      username: overrides?.username ?? "johnDoe",
      password: password,
    },
  });
}