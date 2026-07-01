import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";

export function createAuthRoutes(
  controller: AuthController
) {
  return async function (fastify: FastifyInstance) {
    fastify.post("/login", controller.login);
    fastify.post("/register", controller.register);
    fastify.get( "/me", { preHandler: [fastify.authenticate] }, controller.me );
  };
}