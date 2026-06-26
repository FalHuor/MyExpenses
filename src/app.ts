import Fastify from "fastify";

import prismaPlugin from "./plugins/prisma.js";
import swaggerPlugin from "./plugins/swagger.js";

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

  return app;
}