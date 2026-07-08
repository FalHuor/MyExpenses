import type { Prisma, PrismaClient } from "../../../generated/prisma/client";

export class BankRepository {
  constructor (
    private prisma: PrismaClient
  ) {

  };

  async create(userId: string, name: string) {
    return await this.prisma.bank.create({
      data: {
        name,
        userId,
      },
      select : bankSelect
    });
  };

  async update(id: string, name: string) {
    return await this.prisma.bank.update({
      where: {
        id,
      },
      data: {
        name: name
      },
      select: bankSelect
    });
  };

  async findById(bankId: string) {
    return await this.prisma.bank.findUnique({
      where: {
        id: bankId
      },
    });
  };

  async findAllByUser(userId: string) {
    return await this.prisma.bank.findMany({
      where: {
        userId: userId
      },
      select: bankSelect,
    });
  };

  async findByName(userId: string, name: string, excluededBankId?: string) {
    return await this.prisma.bank.findFirst({
      where: {
        userId,
        name,
      },
      select: bankSelect,
    })
  }

  async delete(bankId: string) {
    return await this.prisma.bank.delete({
      where: {
        id: bankId,
      },
      select: bankSelect,
    });
  };
}

export const bankSelect = {
    id: true,
    name: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.BankSelect;