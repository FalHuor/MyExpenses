import { expect, test, describe, beforeEach, afterEach } from "vitest";
import { BankService } from "../../modules/bank/bank.service";
import { bankRepositoryMock } from "./helpers";
import { createLoggerMock } from "../helpers/logger";
import { ConflictError } from "../../core/errors/conflictError";
import { NotFoundError } from "../../core/errors/notFoundError";
import { ForbiddenError } from "../../core/errors/forbiddenError";

let repository: ReturnType<typeof bankRepositoryMock>;
let logger: ReturnType<typeof createLoggerMock>;
let service: BankService;

describe("BankService.create", () => {

  beforeEach(() => {
    repository = bankRepositoryMock();
    logger = createLoggerMock();
    service = new BankService(repository, logger);
  })

  test("should create a bank", async () => {
    // Arrange
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    // Act
    const result = await service.create(
      "user-id",
      "Revolut",
    );

    // Assert
    expect(repository.findByName)
      .toHaveBeenCalledWith(
        "user-id",
        "Revolut",
      );

    expect(repository.create)
      .toHaveBeenCalledWith(
        "user-id",
        "Revolut",
      );
    
    expect(result.name)
      .toBe("Revolut");
  });

  test("should throw ConflictError when bank name already exists", async () => {
    // Arrange
    repository.findByName.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    }); 

    // Act & Assert
    await expect(
      service.create(
        "user-id",
        "Revolut",
      ),
    ).rejects.toThrow(ConflictError);

    expect(repository.create).not.toHaveBeenCalled();

  })
})

describe("BankService.getAll", () => {

  beforeEach(() => {
    repository = bankRepositoryMock();
    logger = createLoggerMock();
    service = new BankService(repository, logger);
  });

  test("should return all bank owned by user", async () => {
    // Arrange
    repository.findAllByUser.mockResolvedValue([
      {
        name: "Revolut",
        id: "bank-id-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-id",
      }, {
        name: "Credit Agricole",
        id: "bank-id-2",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-id",
      }, {
        name: "Credit Mutuel",
        id: "bank-id-3",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-id",
      }
    ]);

    // Act
    const result = await service.getAll(
      "user-id",
    );

    
    // Assert
    expect(repository.findAllByUser)
      .toHaveBeenCalledWith(
        "user-id",
      );
    
    expect(result.length)
      .toBe(3);
  });

});

describe("BankService.getById", () => {

  beforeEach(() => {
    repository = bankRepositoryMock();
    logger = createLoggerMock();
    service = new BankService(repository, logger);
  });

  test("should return a bank by Id", async () => {
    // Arrange
    repository.findById.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    // Act
    const result = await service.getById(
      "user-id",
      "bank-id",
    );

    
    // Assert
    expect(repository.findById)
      .toHaveBeenCalledWith(
        "bank-id",
      );
    
    expect(result.name)
      .toBe("Revolut");

    expect(result.userId)
      .toBe("user-id");
  });

  test("should throw NotFoundError when bankId doesn't exist", async () => {
    // Arrange
    repository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      service.getById(
        "user-id",
        "Revolut",
      ),
    ).rejects.toThrow(NotFoundError);
  });

  test("should throw ForbiddenError when owner is another user", async () => {
    // Arrange
    repository.findById.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id-2",
    });

    // Act & Assert
    await expect(
      service.getById(
        "user-id-1",
        "bank-id",
      ),
    ).rejects.toThrow(ForbiddenError);
  });
});

describe("BankService.update", () => {

  beforeEach(() => {
    repository = bankRepositoryMock();
    logger = createLoggerMock();
    service = new BankService(repository, logger);
  });

  test("should update a bank", async () => {
    // Arrange
    repository.findById.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    repository.update.mockResolvedValue({
      name: "Credit Mutuel",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    // Act
    const result = await service.update(
      "user-id",
      "bank-id",
      "Credit Mutuel",
    );

    // Assert
    expect(repository.findById)
      .toHaveBeenCalledWith(
        "bank-id"
      );

    expect(repository.findByName)
      .toHaveBeenCalledWith(
        "user-id",
        "Credit Mutuel",
      );

    expect(repository.update)
      .toHaveBeenCalledWith(
        "bank-id",
        "Credit Mutuel",
      );
    
    expect(result.name)
      .toBe("Credit Mutuel");
  });

  test("should throw ConflictError when bank name already exists", async () => {
    // Arrange
    repository.findById.mockResolvedValue({
      name: "Revolut",
      id: "bank-id-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    repository.findByName.mockResolvedValue({
      name: "CIC",
      id: "bank-id-2",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    // Act & Assert
    await expect(
      service.update(
        "user-id",
        "bank-id-1",
        "CIC",
      ),
    ).rejects.toThrow(ConflictError);

    expect(repository.update).not.toHaveBeenCalled();
  });

  test("should throw ForbiddenError when owner is another user", async () => {
    // Arrange
    repository.findById.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id-2",
    });

    // Act & Assert
    await expect(
      service.update(
        "user-id-1",
        "bank-id",
        "CIC"
      ),
    ).rejects.toThrow(ForbiddenError);

    expect(repository.update).not.toHaveBeenCalled();
  });

  test("should throw NotFoundError when bankId doesn't exist", async () => {
    // Arrange
    repository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      service.update(
        "user-id",
        "bank-id",
        "revolut"
      ),
    ).rejects.toThrow(NotFoundError);

    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe("BankService.delete", () => {

  beforeEach(() => {
    repository = bankRepositoryMock();
    logger = createLoggerMock();
    service = new BankService(repository, logger);
  });

  test("should delete a bank", async () => {
    // Arrange
    repository.findById.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    repository.delete.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id",
    });

    // Act
    const result = await service.delete(
      "user-id",
      "bank-id",
    );

    // Assert
    expect(repository.findById)
      .toHaveBeenCalledWith(
        "bank-id"
      );

    expect(repository.delete)
      .toHaveBeenCalledWith(
        "bank-id",
      );
    
    expect(result.name)
      .toBe("Revolut");
  });

  test("should throw NotFoundError when bankId doesn't exist", async () => {
    // Arrange
    repository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      service.delete(
        "user-id",
        "bank-id",
      ),
    ).rejects.toThrow(NotFoundError);

    expect(repository.delete).not.toHaveBeenCalled();
  });

  test("should throw ForbiddenError when owner is another user", async () => {
    // Arrange
    repository.findById.mockResolvedValue({
      name: "Revolut",
      id: "bank-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-id-2",
    });

    // Act & Assert
    await expect(
      service.delete(
        "user-id-1",
        "bank-id",
      ),
    ).rejects.toThrow(ForbiddenError);

    expect(repository.delete).not.toHaveBeenCalled();
  });

});