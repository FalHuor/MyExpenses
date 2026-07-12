import { test, describe, beforeEach, expect } from "vitest";

import { PrismaBankRepository } from "../../../modules/bank/bank.repository";

import { createUser } from "../helpers/factory/user.factory";
import { testDependencies } from "../helpers/dependecies";

beforeEach(async () => {
    await testDependencies.prisma.bank.deleteMany();
    await testDependencies.prisma.user.deleteMany();
});

describe("PrismaBankRepository", () => {

  test("should persist bank into database", async () => {
    // Arrange
    const user = await createUser(testDependencies.prisma);

    const repository = new PrismaBankRepository(testDependencies.prisma);

    // Act
    const bank = await repository.create(
      user.id,
      "Revolut",
    );

    // Assert
    expect(bank.name).toBe("Revolut");

    const savedBank = await testDependencies.prisma.bank.findUnique({
      where:{
        id: bank.id
      }
    });

    expect(savedBank).not.toBeNull();
    expect(savedBank?.name).toBe("Revolut");
    expect(savedBank?.userId).toBe(user.id);
  });

  test("should find bank by id", async () => {
    // Arrange
    const user = await createUser(testDependencies.prisma);
    const repository = new PrismaBankRepository(testDependencies.prisma);
    const createdBank = await testDependencies.prisma.bank.create({
      data: {
        userId: user.id,
        name: "Revolut"
      }
    });

    // Act
    const bank = await repository.findById(createdBank.id);
    
    // Assert
    expect(bank).not.toBeNull();
    expect(bank?.name).toBe("Revolut");
    expect(bank?.userId).toBe(user.id);
  });

  test("should find banks by user", async () => {
    // Arrange
    const user1 = await createUser(testDependencies.prisma, { email: "sherlock.holmes@gmail.com", username: "sherlock" });
    const user2 = await createUser(testDependencies.prisma, { email: "john.doe@gmail.com", username: "johnDoe" });
    const repository = new PrismaBankRepository(testDependencies.prisma);
    const createdBank1 = await testDependencies.prisma.bank.create({
      data: {
        userId: user1.id,
        name: "Revolut"
      }
    });
    const createdBank2 = await testDependencies.prisma.bank.create({
      data: {
        userId: user1.id,
        name: "Credit Mutuel"
      }
    });
    const createdBank3 = await testDependencies.prisma.bank.create({
      data: {
        userId: user2.id,
        name: "Revolut"
      }
    });

    // Act
    const banks = await repository.findAllByUser(user1.id);
    
    // Assert
    expect(banks.length).toBe(2);
    expect(banks[0]?.name).toBe("Revolut");
    expect(banks[0]?.userId).toBe(user1.id);
    expect(banks[0]?.id).toBe(createdBank1.id);
    expect(banks[1]?.name).toBe("Credit Mutuel");
    expect(banks[1]?.userId).toBe(user1.id);
    expect(banks[1]?.id).toBe(createdBank2.id);
  });

  test("should update a bank", async () => {
    // Arrange
    const user = await createUser(testDependencies.prisma);
    const repository = new PrismaBankRepository(testDependencies.prisma);
    const bank = await testDependencies.prisma.bank.create({
      data: {
        userId: user.id,
        name: "Revolut"
      }
    });

    // Act
    await repository.update(bank.id, "CIC");
    
    // Assert
    const updatedBank = await testDependencies.prisma.bank.findUnique({
      where: {
        id: bank.id
      }
    });

    expect(updatedBank).not.toBeNull();
    expect(updatedBank?.name).toBe("CIC");
    expect(updatedBank?.userId).toBe(user.id);
  });

  test("should delete a bank", async () => {
    // Arrange
    const user = await createUser(testDependencies.prisma);
    const repository = new PrismaBankRepository(testDependencies.prisma);
    const bank = await testDependencies.prisma.bank.create({
      data: {
        userId: user.id,
        name: "Revolut"
      }
    });

    // Act
    await repository.delete(bank.id);
    
    // Assert
    const deletedBank = await testDependencies.prisma.bank.findUnique({
      where: {
        id: bank.id
      }
    });

    expect(deletedBank).toBeNull();
  });

  test("should find bank by name", async () => {
    // Arrange
    const user = await createUser(testDependencies.prisma);
    const repository = new PrismaBankRepository(testDependencies.prisma);
    const bank = await testDependencies.prisma.bank.create({
      data: {
        userId: user.id,
        name: "Revolut"
      }
    });

    // Act
    const bank1 = await repository.findByName(user.id, "Revolut");
    const bank2 = await repository.findByName(user.id, "CIC");
    
    // Assert
  
    expect(bank1).not.toBeNull();
    expect(bank1?.name).toBe("Revolut");
    expect(bank1?.userId).toBe(user.id);
    expect(bank2).toBeNull();
  });
});