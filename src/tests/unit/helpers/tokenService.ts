import { vi, type Mocked } from "vitest";
import type { ITokenService } from "../../../services/tokenService";

export function createTokenServiceMock(): Mocked<ITokenService> {
  return {
    signAccessToken: vi.fn(),
    verifyAccessToken: vi.fn(),
  }
}