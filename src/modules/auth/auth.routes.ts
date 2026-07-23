import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { ValidateBody } from "../../core/http/validate";
import { LoginSchema, RegisterSchema } from "./auth.schemas";

export function createAuthRoutes(
  controller: AuthController
) {
  return async function (fastify: FastifyInstance) {
    fastify.post(
      "/login", 
      { preValidation: ValidateBody(LoginSchema) },
      controller.login
    );
    fastify.post(
      "/register", 
      { preValidation: ValidateBody(RegisterSchema) },
      controller.register
    );
    fastify.get( "/me", { preHandler: [fastify.authenticate] }, controller.me );
  };
}