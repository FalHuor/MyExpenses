import type { FastifyReply, FastifyRequest } from "fastify";

import type { LoginDto, RegisterDto } from "./auth.schemas";
import type { AuthServiceContract } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthServiceContract) {}

  register = async (
    request: FastifyRequest<{ Body: RegisterDto }>,
    reply: FastifyReply
  ) => {
    const user = await this.authService.register(request.body);

    return reply.code(201).send(user);
  }

  login = async (
    request: FastifyRequest<{ Body: LoginDto }>,
    reply: FastifyReply
  ) => {
    const token = await this.authService.login(request.body);

    return reply.code(200).send({ "accessToken": token });
  }

  me = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const user = await this.authService.me(
      request.user.id
    );

    return reply.code(200).send(user);
  }
}