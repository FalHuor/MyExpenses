import Fastify from "fastify";

import prismaPlugin from "./plugins/prisma.js";
import swaggerPlugin from "./plugins/swagger.js";
import { TokenService } from "./services/tokenService.js";
import { PasswordService } from "./services/passwordService.js";
import "dotenv/config";

import authModule from "./modules/auth/index.js"

export const tokenService = new TokenService({
  secret: process.env.JWT_SECRET!,
  expiresIn: "1h",
});

export const passwordService = new PasswordService();

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Plugins
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);

  // Routes
  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

  app.get("/users", async (request, reply) => {
    const users = await app.prisma.user.findMany();

    return users;
  });

  await app.register(authModule, {
    prefix: "/auth",
  });

  return app;
}