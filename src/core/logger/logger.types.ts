import type { Logger } from "pino";

export type AppLogger = Pick<
  Logger,
  "info" | "warn" | "error" | "debug"
>;