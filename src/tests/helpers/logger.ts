import { vi } from "vitest";
import type { AppLogger } from "../../core/logger/logger.types";

export function createLoggerMock(): AppLogger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
}