import { vi, type Mocked } from "vitest";
import type { AuthRepository } from "../../../modules/auth/auth.repository";

export function authRepositoryMock(): Mocked<AuthRepository> {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByUsername: vi.fn(),
    findByLogin: vi.fn()
  }
}