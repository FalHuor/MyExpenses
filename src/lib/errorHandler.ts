import type {
  FastifyError,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { AppError } from "./errors/appError";

export function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {

  if (error instanceof AppError) {

    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    });

  }

  request.log.error(error);

  return reply.status(500).send({
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}