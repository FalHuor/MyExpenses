import { test, describe, beforeEach, expect } from "vitest";

import { PrismaAuthRepository } from "../../../modules/auth/auth.repository";
import { createUser } from "../helpers/factory/user.factory";
import { testDependencies } from "../helpers/dependecies";
import { cleanDatabase } from "../helpers/database";

beforeEach(async () => {
  await cleanDatabase();
});

describe("AuthRepository", () => {
  test("should persist user into database", async () => {
    // Arrange
    const repository = new PrismaAuthRepository(testDependencies.prisma);

    // Act
    const user = await repository.create(
      "alex.rider@gmail.com",
      "motDePasse",
      "Alex",
    );

    // Assert
    expect(user.id).not.toBeNull();

    const savedUser = await testDependencies.prisma.user.findFirst({
      where: {
        email: "alex.rider@gmail.com",
      }
    });

    expect(savedUser).not.toBeNull();
    expect(savedUser?.username).toBe("Alex");
    expect(savedUser?.id).toBe(user.id);
  });

  test("should find user by Id", async () => {
    // Arrange
    const repository = new PrismaAuthRepository(testDependencies.prisma);
    const user = await createUser(testDependencies.prisma);

    // Act
    const getUser = await repository.findById(user.id);

    // Assert
    expect(getUser).not.toBeNull();

    expect(user?.id).toBe(getUser?.id);
  });

  test("should find user by email", async () => {
    // Arrange
    const repository = new PrismaAuthRepository(testDependencies.prisma);
    const user = await createUser(testDependencies.prisma);

    // Act
    const getUser = await repository.findByEmail(user.email);

    // Assert
    expect(getUser).not.toBeNull();

    expect(user?.id).toBe(getUser?.id);
  });

  test("should find user by username", async () => {
    // Arrange
    const repository = new PrismaAuthRepository(testDependencies.prisma);
    const user = await createUser(testDependencies.prisma, {
      email: "harry.potter@gmail.com",
      username: "Cornedrue",
      password: "Alohomora"
    });

    // Act
    const getUser = await repository.findByUsername("Cornedrue");

    // Assert
    expect(getUser).not.toBeNull();
    expect(user?.id).toBe(getUser?.id);
  });

  test("should find user by email login", async () => {
    // Arrange
    const repository = new PrismaAuthRepository(testDependencies.prisma);
    const user = await createUser(testDependencies.prisma);

    // Act
    const getUser = await repository.findByLogin(user.email);

    // Assert
    expect(getUser).not.toBeNull();
    expect(user?.id).toBe(getUser?.id);
    expect(user?.email).toBe(getUser?.email);
  });

  test("should find user by username login", async () => {
    // Arrange
    const repository = new PrismaAuthRepository(testDependencies.prisma);
    const user = await createUser(testDependencies.prisma, {
      email: "harry.potter@gmail.com",
      username: "Cornedrue",
      password: "Alohomora"
    });

    // Act
    const getUser = await repository.findByLogin("Cornedrue");

    // Assert
    expect(getUser).not.toBeNull();
    expect(user?.id).toBe(getUser?.id);
  });
});