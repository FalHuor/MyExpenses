import type { FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { TokenService } from "../services/tokenService";
import { UnauthorizedError } from "../core/errors/unauthorizedError"

export function createAuthPlugin(
  tokenService: TokenService
) {
  return fp(async (fastify) => {
  
    fastify.decorate("authenticate", async function (
      request, 
      reply
    ) {
      const authorization = request.headers.authorization;

      const payload = tokenService.verifyAccessToken(extractBearerToken(authorization));

      request.user = payload;
    });

  });

  function extractBearerToken(authorization?: string): string {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError();
    }

    return authorization.replace("Bearer ", "");
  }
}