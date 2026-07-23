import Fastify from "fastify";
import "dotenv/config";
import { errorHandler } from "./core/errors/errorHandler";
import swaggerPlugin from "./plugins/swagger.js";
import { TokenService } from "./services/tokenService.js";
import { PasswordService } from "./services/passwordService.js";
import { createPrismaPlugin } from "./plugins/prisma";
import { createAuthPlugin } from "./plugins/auth.js";
import { config } from "./core/config/index.js";
import { defaultDependencies, type Dependencies } from "./core/dependencies.js";
import { createAuthModule } from "./modules/auth/index.js";
import { createBankModule } from "./modules/bank";

export const tokenService = new TokenService(config.jwt);

export const passwordService = new PasswordService();

export async function buildApp(dependencies: Dependencies = defaultDependencies) {
  const app = Fastify({
    logger: true,
  });

  const auth = createAuthModule(dependencies);
  const bank = createBankModule(dependencies);

  app.setErrorHandler(errorHandler);

  // Plugins
  // await app.register(createPrismaPlugin(dependencies.prisma));
  await app.register(swaggerPlugin);
  await app.register(createAuthPlugin(dependencies.tokenService))

  // Routes
  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

  await app.register(auth.routes, { prefix: "/auth" });
  await app.register(bank.routes, { prefix: "/banks" });

  // app.get("/users", async (request, reply) => {
  //   const users = await app.prisma.user.findMany();

  //   return users;
  // });

  return app;
}