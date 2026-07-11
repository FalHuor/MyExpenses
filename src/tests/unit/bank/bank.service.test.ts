import { expect, test, describe, beforeEach } from "vitest";
import { BankService } from "../../../modules/bank/bank.service";
import { bankRepositoryMock } from "./helpers";
import { createLoggerMock } from "../../helpers/logger";
import { ConflictError } from "../../../core/errors/conflictError";
import { NotFoundError } from "../../../core/errors/notFoundError";
import { ForbiddenError } from "../../../core/errors/forbiddenError";

let repository: ReturnType<typeof bankRepositoryMock>;
let logger: ReturnType<typeof createLoggerMock>;
let service: BankService;
const date = new Date();

describe("BankService", () => {

  beforeEach(() => {
    repository = bankRepositoryMock();
    logger = createLoggerMock();
    service = new BankService(repository, logger);
  })

  describe("create", () => {

    test("should create a bank", async () => {
      // Arrange
      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
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
    
      expect(result).toEqual({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("Creating"),
      )

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("created"),
      )
    });

    test("should throw ConflictError when bank name already exists", async () => {
      // Arrange
      repository.findByName.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      }); 

      // Act & Assert
      await expect(
        service.create(
          "user-id",
          "Revolut",
        ),
      ).rejects.toThrow(ConflictError);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("already exist"),
      );

      expect(repository.create).not.toHaveBeenCalled();

    })
  });

  describe("getAll", () => {

    test("should return all bank owned by user", async () => {
      // Arrange
      repository.findAllByUser.mockResolvedValue([
        {
          name: "Revolut",
          id: "bank-id-1",
          createdAt: date,
          updatedAt: date,
          userId: "user-id",
        }, {
          name: "Credit Agricole",
          id: "bank-id-2",
          createdAt: date,
          updatedAt: date,
          userId: "user-id",
        }, {
          name: "Credit Mutuel",
          id: "bank-id-3",
          createdAt: date,
          updatedAt: date,
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
      
      expect(result).toEqual([
        {
          name: "Revolut",
          id: "bank-id-1",
          createdAt: date,
          updatedAt: date,
          userId: "user-id",
        }, {
          name: "Credit Agricole",
          id: "bank-id-2",
          createdAt: date,
          updatedAt: date,
          userId: "user-id",
        }, {
          name: "Credit Mutuel",
          id: "bank-id-3",
          createdAt: date,
          updatedAt: date,
          userId: "user-id",
        }
      ]);
    });
  });


  describe("getById", () => {

    test("should return a bank by Id", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
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
      
      expect(result).toEqual({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("get"),
      );
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

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("not found"),
      );
    });

    test("should throw ForbiddenError when owner is another user", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id-2",
      });

      // Act & Assert
      await expect(
        service.getById(
          "user-id-1",
          "bank-id",
        ),
      ).rejects.toThrow(ForbiddenError);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("forbidden"),
      );
    });
  });


  describe("update", () => {

    test("should update a bank", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      repository.update.mockResolvedValue({
        name: "Credit Mutuel",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
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
      
      expect(result).toEqual({
        name: "Credit Mutuel",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("Updating"),
      );

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("updated"),
      );
    });

    test("should throw ConflictError when bank name already exists", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id-1",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      repository.findByName.mockResolvedValue({
        name: "CIC",
        id: "bank-id-2",
        createdAt: date,
        updatedAt: date,
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

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("already exists"),
      );
    });

    test("should throw ForbiddenError when owner is another user", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
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

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("forbidden"),
      );
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

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("not found"),
      );
    });

    test("should update bank with unchanged name", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      repository.findByName.mockResolvedValue({
        name: "revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      repository.update.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      // Act
      const result = await service.update(
        "user-id",
        "bank-id",
        "Revolut",
      );

      // Assert
      expect(repository.findById)
        .toHaveBeenCalledWith(
          "bank-id"
        );

      expect(repository.findByName)
        .toHaveBeenCalledWith(
          "user-id",
          "Revolut",
        );

      expect(repository.update)
        .toHaveBeenCalledWith(
          "bank-id",
          "Revolut",
        );
      
      expect(result).toEqual({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("Updating"),
      );

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("updated"),
      );
    });
  });

  describe("delete", () => {

    test("should delete a bank", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      repository.delete.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
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
      
      expect(result).toEqual({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("Delete"),
      );

      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("deleted"),
      );
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

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("not found"),
      );
    });

    test("should throw ForbiddenError when owner is another user", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
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

      expect(logger.warn).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("forbidden"),
      );
    });
  });
});