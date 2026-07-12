import type { PrismaClient } from "../../../../../generated/prisma/client";

export async function createUser(
  prisma: PrismaClient,
  overrides?: {
    email?: string;
    username?: string;
    password?: string;
  },
) {
  return prisma.user.create({
    data: {
      email: overrides?.email ?? "john.doe@test.fr",
      username: overrides?.username ?? "johnDoe",
      password: overrides?.password ?? "hashed-password",
    },
  });
}