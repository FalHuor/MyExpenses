import type { FastifyInstance } from "fastify";
import { BankController } from "./bank.controller";

export function createBankRoutes(
  controller: BankController
) {
  return async function (fastify: FastifyInstance) {
    fastify.post("/", { preHandler: [fastify.authenticate] }, controller.create);
    fastify.patch("/:bankId", { preHandler: [fastify.authenticate] }, controller.update);
    fastify.get("/:bankId", { preHandler: [fastify.authenticate] }, controller.getOne);
    fastify.get("/", { preHandler: [fastify.authenticate] }, controller.getMany);
    fastify.delete("/:bankId", { preHandler: [fastify.authenticate] }, controller.delete);
  }
}