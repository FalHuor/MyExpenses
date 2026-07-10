import { ConflictError } from "../../core/errors/conflictError";
import { ErrorCodes } from "../../core/errors/errorCodes";
import type { BankRepository } from "./bank.repository";
import { NotFoundError } from "../../core/errors/notFoundError";
import { ForbiddenError } from "../../core/errors/forbiddenError";
import type { Bank } from "../../../generated/prisma/client";
import type { AppLogger } from "../../core/logger/logger.types";

export class BankService {
  constructor (
    private bankRepository: BankRepository, 
    private logger: AppLogger,
  ) {}

  async create(userId: string, name: string) {
    this.logger.info({
      userId: userId,
      name: name
    }, "Creating new bank");
    await this.ensureBankNameIsAvailable(userId, name);
    const bank = await this.bankRepository.create(userId, name);

    this.logger.info({
      userId: userId,
      bankId: bank.id,
      name: name,
    }, "Bank created");

    return bank;
  }

  async getAll(userId: string) {
    return this.bankRepository.findAllByUser(userId);
  }

  async getById(userId: string, bankId: string) {
    return await this.getOwnedBank(userId, bankId);
  }

  async update(userId: string, bankId: string, name: string) {
    this.logger.info({
      userId: userId,
      bankId: bankId,
      newName: name,
    }, "Updating bank");

    await this.getOwnedBank(userId, bankId);
    await this.ensureBankNameIsAvailable(userId, name, bankId);

    const bank = await this.bankRepository.update(bankId, name);
    this.logger.info({
      userId: bank.userId,
      bankId: bank.id,
      name: bank.name,
    }, "Bank updated");

    return bank;
  }

  async delete(userId: string, bankId: string) {
    this.logger.info({
      userId: userId,
      bankId: bankId,
    }, "Delete bank");

    await this.getOwnedBank(userId, bankId);
    const bank = await this.bankRepository.delete(bankId);

    this.logger.info({
      userId: bank.userId,
      bankId: bank.id,
      name: bank.name,
    }, "Bank deleted");

    return bank;
  }


  private async ensureBankNameIsAvailable(userId: string, name: string, excluededBankId?: string) {
    const existing = await this.bankRepository.findByName(userId, name);

    if (existing && existing.id !== excluededBankId) {
      this.logger.warn({
        userId: existing.userId,
        bankId: existing.id,
        name: existing.name,
      }, "Bank name already exists");

      throw new ConflictError(ErrorCodes.BANK_NAME_ALREADY_EXISTS, "Bank name already exist");
    }
  }

  private ensureUserOwnsBank(bank: Bank, userId: string) {
    if (bank.userId !== userId) {
      this.logger.warn({
        userId: userId,
        ownerUserId: bank.userId,
        bankId: bank.id,
        name: bank.name,
      }, "forbidden - User attempted to access another user's bank");

      throw new ForbiddenError(ErrorCodes.BANK_ACCESS_FORBIDDEN, "Bank access forbidden");
    }
  }

  private async getOwnedBank(userId: string, bankId: string) {
    const bank = await this.bankRepository.findById(bankId);

    if (!bank) {
      this.logger.warn({
        bankId: bankId
      }, "Bank not found");

      throw new NotFoundError(ErrorCodes.BANK_NOT_FOUND, "Bank not found");
    }

    this.logger.info({
      userId: bank.userId,
      bankId: bank.id,
      name: bank.name,
    }, "get bank");


    this.ensureUserOwnsBank(bank, userId);
    return bank;
  }
}