import { expect, test, describe, beforeEach } from "vitest";
import { bankServiceMock } from "./helpers";
import { BankController } from "../../../modules/bank/bank.controller";
import { createBankBody, createUser, paramsBankBody } from "../helpers/bank";
import { createRequest, createReply } from "../helpers/fastify";

let service: ReturnType<typeof bankServiceMock>
let controller: BankController
const date = new Date();

describe("BankController", () => {

  beforeEach(() => {
    service = bankServiceMock();
    controller = new BankController(service);
  });

  describe("create", () => {

    test("should call service.create with correct arguments", async () => {
      // Arrange
      service.create.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        body: createBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.create(request, reply);

      // Assert
      expect(service.create).toHaveBeenCalledWith(
        "user-id",
        "Revolut",
      );
    });

    test("should call service.create and return code 201", async () => {
      // Arrange
      service.create.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        body: createBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.create(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });
    });
  });

  describe("getOne", () => {
    test("should call service.getById with correct arguments", async () => {
      // Arrange
      service.getById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.getOne(request, reply);

      // Assert
      expect(service.getById).toHaveBeenCalledWith(
        "user-id",
        "bank-id",
      );
    });

    test("should call service.getById and return code 200", async () => {
      // Arrange
      service.getById.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.getOne(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });
    });
  });

  describe("getAll", () => {
    test("should call service.getAll with correct arguments", async () => {
      // Arrange
      service.getAll.mockResolvedValue(
      [{
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      }]);

      const request = createRequest({
        user: createUser(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.getMany(request, reply);

      // Assert
      expect(service.getAll).toHaveBeenCalledWith(
        "user-id",
      );
    });

    test("should call service.getAll and return code 200", async () => {
      // Arrange
      service.getAll.mockResolvedValue(
      [{
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      }]);

      const request = createRequest({
        user: createUser(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.getMany(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith([{
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      }]);
    });
  });

  describe("update", () => {

    test("should call service.update with correct arguments", async () => {
      // Arrange
      service.update.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        body: createBankBody(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.update(request, reply);

      // Assert
      expect(service.update).toHaveBeenCalledWith(
        "user-id",
        "bank-id",
        "Revolut",
      );
    });

    test("should call service.update and return code 200", async () => {
      // Arrange
      service.update.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        body: createBankBody(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.update(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });
    });
  });

  describe("delete", () => {

    test("should call service.delete with correct arguments", async () => {
      // Arrange
      service.delete.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.delete(request, reply);

      // Assert
      expect(service.delete).toHaveBeenCalledWith(
        "user-id",
        "bank-id",
      );
    });

    test("should call service.delete and return code 200", async () => {
      // Arrange
      service.delete.mockResolvedValue({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });

      const request = createRequest({
        user: createUser(),
        params: paramsBankBody(),
      });
      const reply = createReply();

      // Act
      await controller.delete(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        name: "Revolut",
        id: "bank-id",
        createdAt: date,
        updatedAt: date,
        userId: "user-id",
      });
    });
  });
});