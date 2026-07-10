import { env } from "./env";
import type { SignOptions } from "jsonwebtoken";

export const config = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  },

  logger: {
    level: env.LOG_LEVEL,
  },

  database: {
    url: env.DATABASE_URL,
  },
};