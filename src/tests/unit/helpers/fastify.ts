import { vi } from "vitest";
import type { FastifyReply, FastifyRequest } from "fastify";

export function createReply() {
  const reply = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };

  return reply as unknown as FastifyReply;
}

export function createRequest<T>(data: Partial<T>) {
  return data as FastifyRequest & T;
}