import type { FastifyInstance } from "fastify";
import { BankController } from "./bank.controller";
import { ValidateBody, ValidateParams } from "../../core/http/validate";
import { BankParamsSchema, CreateBankSchema, UpdateBankSchema } from "./bank.schemas";

export function createBankRoutes(
  controller: BankController
) {
  return async function (fastify: FastifyInstance) {
    fastify.post(
      "/", 
      { preHandler: [fastify.authenticate], preValidation: ValidateBody(CreateBankSchema) },
      controller.create
    );
    fastify.patch(
      "/:bankId", 
      { preHandler: [fastify.authenticate], preValidation: [ValidateParams(BankParamsSchema), ValidateBody(UpdateBankSchema)] },
      controller.update
    );
    fastify.get(
      "/:bankId", 
      { preHandler: [fastify.authenticate], preValidation: ValidateParams(BankParamsSchema) },
      controller.getOne
    );
    fastify.get(
      "/", 
      { preHandler: [fastify.authenticate] },
      controller.getMany
    );
    fastify.delete(
      "/:bankId", 
      { preHandler: [fastify.authenticate], preValidation: ValidateParams(BankParamsSchema)  },
      controller.delete
    );
  }
}