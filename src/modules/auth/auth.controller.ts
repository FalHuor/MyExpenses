import type { FastifyReply, FastifyRequest } from "fastify";

import type { LoginDto, RegisterDto } from "./auth.schemas";
import type { AuthServiceContract } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthServiceContract) {}

  register = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dto = request.body as RegisterDto;

    const user = await this.authService.register(dto);

    return reply.code(201).send(user);
  }

  login = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dto = request.body as LoginDto;

    const token = await this.authService.login(dto);

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