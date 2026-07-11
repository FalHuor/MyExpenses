import type { BankCreateDto, BankParamsDto, BankUpdateDto } from "../../modules/bank/bank.schemas";

export function createBankBody(overrides: Partial<BankCreateDto> = {}): BankCreateDto {
  return {
    name: "Revolut",
    ...overrides,
  };
}

export function paramsBankBody(overrides: Partial<BankParamsDto> = {}): BankParamsDto {
  return {
    bankId: "bank-id",
    ...overrides,
  };
}

export function createUser(overrides = {}) {
  return {
    id: "user-id",
    ...overrides,
  };
}