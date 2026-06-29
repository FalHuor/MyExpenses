import "fastify";

import { prisma } from "../lib/prisma.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}