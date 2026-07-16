import { vi, type Mocked } from "vitest";
import type { IPasswordService } from "../../../services/passwordService";

export function createPasswordServiceMock(): Mocked<IPasswordService> {
  return {
    hash: vi.fn(),
    verify: vi.fn(),
  }
}