import { prisma } from "../core/database/prisma";
import { logger } from "../core/logger/logger";

import { PasswordService } from "../services/passwordService";
import { TokenService } from "../services/tokenService";

import { config } from "./config";

const passwordService = new PasswordService();

const tokenService = new TokenService(config.jwt);

export const dependencies = {
  prisma,
  logger,
  passwordService,
  tokenService,
};

export type Dependencies = typeof dependencies;