import { vi, type Mocked } from "vitest";
import type { BankRepository } from "../../modules/bank/bank.repository";

export function bankRepositoryMock(): Mocked<BankRepository> {
  return {
    create: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    findAllByUser: vi.fn(),
    delete: vi.fn(),
  };
}