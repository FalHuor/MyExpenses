import { vi, type Mocked } from "vitest";
import type { BankRepository } from "../../../modules/bank/bank.repository";
import type { BankServiceContract  } from "../../../modules/bank/bank.service";

export function BankRepositoryMock(): Mocked<BankRepository> {
  return {
    create: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    findAllByUser: vi.fn(),
    delete: vi.fn(),
  };
}

export function BankServiceMock(): Mocked<BankServiceContract > {
  return {
    create: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    delete: vi.fn(),
  }
}