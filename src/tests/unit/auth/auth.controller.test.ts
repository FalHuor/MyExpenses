import { expect, test, describe, beforeEach } from "vitest";
import { AuthServiceMock } from "./auth.helpers";
import { AuthController } from "../../../modules/auth/auth.controller";
import { createReply, createRequest } from "../helpers/fastify";

let service: ReturnType<typeof AuthServiceMock>;
let controller: AuthController;
const date = new Date();

describe("AuthController", () => {

  beforeEach(() => {
    service = AuthServiceMock();
    controller = new AuthController(service);
  });

  describe("register", () => {

    test("should call service.register with correct arguments", async () => {
      // Arrange
      service.register.mockResolvedValue({
        email: "alex@gmail.com",
        username: "Alex",
        id: "user-id",
      });

      const request = createRequest({
        body: {
          email: "alex@gmail.com",
          username: "Alex",
          password: "AS15deQA65",
        },
      });
      const reply = createReply();

      // Act
      await controller.register(request, reply);

      // Assert
      expect(service.register).toHaveBeenCalledWith({
        email: "alex@gmail.com",
        username: "Alex",
        password: "AS15deQA65",
      });
    });

    test("should call service.register and return code 201", async () => {
      // Arrange
      service.register.mockResolvedValue({
        email: "alex@gmail.com",
        username: "Alex",
        id: "user-id",
      });

      const request = createRequest({
        body: {
          email: "alex@gmail.com",
          username: "Alex",
          password: "AS15deQA65",
        },
      });
      const reply = createReply();

      // Act
      await controller.register(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({
        email: "alex@gmail.com",
        username: "Alex",
        id: "user-id",
      });
    });

  });

  describe("login", () => {

    test("should call service.register with correct arguments", async () => {
      // Arrange
      service.login.mockResolvedValue("token");

      const request = createRequest({
        body: {
          login: "alex@gmail.com",
          password: "AS15deQA65",
        },
      });
      const reply = createReply();

      // Act
      await controller.login(request, reply);

      // Assert
      expect(service.login).toHaveBeenCalledWith({
        login: "alex@gmail.com",
        password: "AS15deQA65",
      });
    });

    test("should call service.register and return code 201", async () => {
      // Arrange
      service.login.mockResolvedValue("token");

      const request = createRequest({
        body: {
          login: "alex@gmail.com",
          password: "AS15deQA65",
        },
      });
      const reply = createReply();

      // Act
      await controller.login(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        accessToken: "token"
      });
    });

  });

  describe("me", () => {

    test("should call service.me with correct arguments", async () => {
      // Arrange
      service.me.mockResolvedValue({
        email: "alex@gmail.com",
        username: "Alex",
        id: "user-id",
      });

      const request = createRequest({
        user: { id: "user-id" },
      });
      const reply = createReply();

      // Act
      await controller.me(request, reply);

      // Assert
      expect(service.me).toHaveBeenCalledWith("user-id");
    });

    test("should call service.me and return code 201", async () => {
      // Arrange
      service.me.mockResolvedValue({
        email: "alex@gmail.com",
        username: "Alex",
        id: "user-id",
      });

      const request = createRequest({
        user: { id: "user-id" },
      });
      const reply = createReply();

      // Act
      await controller.me(request, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        email: "alex@gmail.com",
        username: "Alex",
        id: "user-id",
      });
    });

  });

})