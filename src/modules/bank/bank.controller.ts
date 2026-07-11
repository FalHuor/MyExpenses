import type { FastifyReply, FastifyRequest } from "fastify";
import type { BankCreateDto, BankParamsDto, BankUpdateDto } from "./bank.schemas";
import { type BankServiceContract } from "./bank.service";


export class BankController {
  constructor(private bankService: BankServiceContract) {}

  create = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { name } = request.body as BankCreateDto;

    const bank = await this.bankService.create(
      request.user.id,
      name
    )

    return reply.code(201).send(bank);
  }

  getOne = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { bankId } = request.params as BankParamsDto;

    const bank = await this.bankService.getById(
      request.user.id,
      bankId
    )

    return reply.code(200).send(bank);
  }

  getMany = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const banks = await this.bankService.getAll(
      request.user.id
    )

    return reply.code(200).send(banks);
  }

  delete = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { bankId } = request.params as BankParamsDto;
    const bank = await this.bankService.delete(
      request.user.id,
      bankId
    )

    return reply.code(200).send(bank);
  }

  update = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { bankId } = request.params as BankParamsDto;
    const { name } = request.body as BankUpdateDto;

    const bank = await this.bankService.update(
      request.user.id,
      bankId,
      name
    )

    return reply.code(200).send(bank);
  }
}