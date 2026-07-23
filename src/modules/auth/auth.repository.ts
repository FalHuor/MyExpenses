import type { Bank, Prisma, PrismaClient, User } from "../../../generated/prisma/client";

export class PrismaAuthRepository implements AuthRepository {
  constructor (
    private prisma: PrismaClient
  ) {};

  async create(email: string, password: string, username?: string): Promise<UserSummary> {
    return await this.prisma.user.create({
      data: {
        email,
        password,
        username: username || null,
      },
      select: userSelect,
    });
  }

  async findById(userId: string): Promise<UserSummary | null> {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: userSelect,
    })
  }

  async findByEmail(email: string): Promise<UserSummary | null> {
    return await this.prisma.user.findFirst({
      where: {
        email
      },
      select: userSelect,
    })
  }

  async findByUsername(username: string): Promise<UserSummary | null> {
    return await this.prisma.user.findFirst({
      where: {
        username
      },
      select: userSelect,
    })
  }

  async findByLogin(login: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          { username: login },
        ]
      },
      select: userSelectWithPassword,
    });
  }
};

export interface AuthRepository {
  create(email: string, password: string, username?: string): Promise<UserSummary>;
  findById(userId: string): Promise<UserSummary | null>;
  findByEmail(email: string): Promise<UserSummary | null>;
  findByUsername(username: string): Promise<UserSummary | null>;
  findByLogin(login: string): Promise<User | null>;
}

export const userSelect = {
    id: true,
    username: true,
    email: true
} satisfies Prisma.UserSelect;

export const userSelectWithPassword = {
    id: true,
    username: true,
    email: true,
    password: true,
    createdAt: true,
    updatedAt: true
} satisfies Prisma.UserSelect;

export interface UserSummary {
  id: string;
  email: string;
  username: string | null;
}