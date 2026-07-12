import type { PrismaClient } from "../../../../../generated/prisma/client";

export async function createBank(
  prisma: PrismaClient,
  userId: string,
  overrides?: {
    name?: string;
  },
) {
  return prisma.bank.create({
    data: {
      name: overrides?.name ?? "Revolut",
      userId
    },
  });
}