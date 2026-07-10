import "fastify";

import { prisma } from "../lib/prisma.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;

    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  };

  interface FastifyRequest {
    user: JwtPayload
  };
}