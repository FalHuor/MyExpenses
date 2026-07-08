import type { FastifyReply, FastifyRequest } from "fastify";
import type { BankCreateDto, BankDeleteDto, BankGetOneDto, BankUpdateDto } from "./bank.schemas";
import { BankService } from "./bank.service";


export class BankController {
  constructor(private bankService: BankService) {}

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
    const { id } = request.body as BankGetOneDto;

    const bank = await this.bankService.getById(
      request.user.id,
      id
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
    const { id } = request.body as BankDeleteDto;

    const bank = await this.bankService.delete(
      request.user.id,
      id
    )

    return reply.code(200).send(bank);
  }

  update = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id, name } = request.body as BankUpdateDto;

    const bank = await this.bankService.update(
      request.user.id,
      id,
      name
    )

    return reply.code(200).send(bank);
  }
}