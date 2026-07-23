import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";

export function ValidateBody(schema: z.ZodType) {
  return async (
    request: FastifyRequest, 
    reply: FastifyReply
  ) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: z.treeifyError(result.error),
      });
    }

    request.body = result.data;
  };
}

export function ValidateParams(schema: z.ZodType) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const result = schema.safeParse(request.params);

    if (!result.success) {
      return reply.status(400).send({
        message: "Invalid parameters",
        errors: z.treeifyError(result.error),
      });
    }

    request.params = result.data;
  };
}