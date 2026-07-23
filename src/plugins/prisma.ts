import fp from "fastify-plugin";
import type { PrismaClient } from "../../generated/prisma/client";

export function createPrismaPlugin(
  prisma: PrismaClient,
) {
  return fp(async (fastify) => {
    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async () => {
      await prisma.$disconnect();
    });
  });
}