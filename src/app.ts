import Fastify from "fastify";

import { errorHandler } from "./lib/errorHandler.js";
import prismaPlugin from "./plugins/prisma.js";
import swaggerPlugin from "./plugins/swagger.js";
import { TokenService } from "./services/tokenService.js";
import { PasswordService } from "./services/passwordService.js";
import "dotenv/config";

import authModule from "./modules/auth/index.js"
import { createAuthPlugin } from "./plugins/auth.js";

export const tokenService = new TokenService({
  secret: process.env.JWT_SECRET!,
  expiresIn: "1h",
});

export const passwordService = new PasswordService();

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.setErrorHandler(errorHandler);

  // Plugins
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);
  await app.register(createAuthPlugin(tokenService))

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