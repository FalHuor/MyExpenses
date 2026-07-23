import { prisma } from "../../../core/database/prisma";

export async function cleanDatabase() {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.bank.deleteMany();
    await prisma.user.deleteMany();
}