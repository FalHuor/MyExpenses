import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../../core/config";

// export function createPrisma(url: string) {
//   const adapter = new PrismaPg(url);

//   return new PrismaClient({
//     adapter,
//   });
// }

// export const prisma = createPrisma(
//   config.database.url,
// );

const adapter = new PrismaPg(config.database.url);

export const prisma = new PrismaClient({
  adapter,
});