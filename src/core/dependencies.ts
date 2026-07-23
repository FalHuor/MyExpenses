import { prisma } from "../core/database/prisma";

import { PasswordService } from "../services/passwordService";
import { TokenService } from "../services/tokenService";

import { config } from "./config";
import { logger } from "./logger/logger";

const passwordService = new PasswordService();

const tokenService = new TokenService(config.jwt);

export const defaultDependencies = {
  prisma,
  logger,
  passwordService,
  tokenService,
};

export type Dependencies = typeof defaultDependencies;