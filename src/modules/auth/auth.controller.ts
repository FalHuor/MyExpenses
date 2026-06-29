import type { FastifyReply, FastifyRequest } from "fastify";

import type { LoginDto, RegisterDto } from "./auth.schemas";
import { AuthService } from "./auth.service";
import { request } from "node:http";

export class AuthController {
  constructor(private authService: AuthService) {}

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

    return reply.code(200).send(token);
  }
}