import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../../core/config";

const adapter = new PrismaPg(config.database.url);

export const prisma = new PrismaClient({
  adapter,
});