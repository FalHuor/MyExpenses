import { vi, type Mocked } from "vitest";
import type { AuthRepository } from "../../../modules/auth/auth.repository";
import type { AuthServiceContract } from "../../../modules/auth/auth.service";

export function AuthRepositoryMock(): Mocked<AuthRepository> {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByUsername: vi.fn(),
    findByLogin: vi.fn()
  }
}

export function AuthServiceMock(): Mocked<AuthServiceContract> {
  return {
    register: vi.fn(),
    login: vi.fn(),
    me: vi.fn(),
  }
}