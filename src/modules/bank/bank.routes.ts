import type { FastifyInstance } from "fastify";
import { BankController } from "./bank.controller";
import { ValidateBody } from "../../core/http/validate";
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
      { preHandler: [fastify.authenticate], preValidation: ValidateBody(UpdateBankSchema)  },
      controller.update
    );
    fastify.get(
      "/:bankId", 
      { preHandler: [fastify.authenticate], preValidation: ValidateBody(BankParamsSchema)  },
      controller.getOne
    );
    fastify.get(
      "/", 
      { preHandler: [fastify.authenticate], preValidation: ValidateBody(BankParamsSchema)  },
      controller.getMany
    );
    fastify.delete(
      "/:bankId", 
      { preHandler: [fastify.authenticate], preValidation: ValidateBody(BankParamsSchema)  },
      controller.delete
    );
  }
}