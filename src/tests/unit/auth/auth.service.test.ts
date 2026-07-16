import { expect, test, describe, beforeEach } from "vitest";
import { authRepositoryMock } from "./auth.helpers";
import { AuthService } from "../../../modules/auth/auth.service";
import { createTokenServiceMock } from "../helpers/tokenService";
import { createPasswordServiceMock } from "../helpers/passwordService";
import { createLoggerMock } from "../helpers/logger";
import { ConflictError } from "../../../core/errors/conflictError";
import { InvalidCredentialsError } from "../../../core/errors/invalidCredentialsError";

let repository: ReturnType<typeof authRepositoryMock>;
let service: AuthService;
let tokenService: ReturnType<typeof createTokenServiceMock>;
let passwordService: ReturnType<typeof createPasswordServiceMock>;
let logger: ReturnType<typeof createLoggerMock>;
const date = new Date();

describe("AuthService", () => {
  beforeEach(() => {
    repository = authRepositoryMock();
    tokenService = createTokenServiceMock();
    passwordService = createPasswordServiceMock();
    logger = createLoggerMock();
    service = new AuthService(repository, tokenService, passwordService, logger);
  });

  describe("register", () => {

    test("should register a user", async () => {
      // Arrange
      repository.findByEmail.mockResolvedValue(null);
      repository.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashedPassword");
      repository.create.mockResolvedValue({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
      });

      // Act
      const result = await service.register({
        email: "user@gmail.com",
        username: "username",
        password: "password",
      });

      // Assert 
      expect(repository.findByEmail).toHaveBeenCalledWith("user@gmail.com");
      expect(repository.findByUsername).toHaveBeenCalledWith("username");
      expect(passwordService.hash).toHaveBeenCalledWith("password");
      expect(repository.create).toHaveBeenCalledWith("user@gmail.com", "hashedPassword", "username");
      expect(result).toStrictEqual({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
      });
      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("registered"),
      );
    });

    test("should throw ConflictError when email is already used", async () => {
      // Arrange
      repository.findByEmail.mockResolvedValue({
        id: "other-user-id",
        email: "user@gmail.com",
        username: null
      });
      repository.findByUsername.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
      });

      // Act & Assert
      await expect(
        service.register({
          email: "user@gmail.com",
          username: "username",
          password: "password",
        }),
      ).rejects.toThrow(ConflictError);

      expect(repository.findByEmail).toHaveBeenCalledWith("user@gmail.com");
      expect(repository.findByUsername).not.toHaveBeenCalled();
      expect(passwordService.hash).not.toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
    });

    test("should throw ConflictError when username is already used", async () => {
      // Arrange
      repository.findByEmail.mockResolvedValue(null);
      repository.findByUsername.mockResolvedValue({
        id: "other-user-id",
        email: "other.user@gmail.com",
        username: "username"
      });
      repository.create.mockResolvedValue({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
      });

      // Act & Assert
      await expect(
        service.register({
          email: "user@gmail.com",
          username: "username",
          password: "password",
        }),
      ).rejects.toThrow(ConflictError);

      expect(repository.findByEmail).toHaveBeenCalledWith("user@gmail.com");
      expect(repository.findByUsername).toHaveBeenCalledWith("username");
      expect(passwordService.hash).not.toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {

    test("should login a user with email", async () => {
      // Arrange
      repository.findByLogin.mockResolvedValue({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
        password: "hashedPassword",
        createdAt: date,
        updatedAt: date,
      });
      passwordService.verify.mockResolvedValue(true);
      tokenService.signAccessToken.mockResolvedValue("token");

      // Act
      const result = await service.login({
        login: "user@gmail.com",
        password: "password",
      });

      // Assert 
      expect(repository.findByLogin).toHaveBeenCalledWith("user@gmail.com");
      expect(passwordService.verify).toHaveBeenCalledWith("password", "hashedPassword");
      expect(tokenService.signAccessToken).toHaveBeenCalledWith({ id: "user-id", email: "user@gmail.com" });
      expect(result).toStrictEqual("token");
      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("logged in"),
      );
    });

    test("should login a user with username", async () => {
      // Arrange
      repository.findByLogin.mockResolvedValue({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
        password: "hashedPassword",
        createdAt: date,
        updatedAt: date,
      });
      passwordService.verify.mockResolvedValue(true);
      tokenService.signAccessToken.mockResolvedValue("token");

      // Act
      const result = await service.login({
        login: "username",
        password: "password",
      });

      // Assert 
      expect(repository.findByLogin).toHaveBeenCalledWith("username");
      expect(passwordService.verify).toHaveBeenCalledWith("password", "hashedPassword");
      expect(tokenService.signAccessToken).toHaveBeenCalledWith({ id: "user-id", email: "user@gmail.com" });
      expect(result).toStrictEqual("token");
      expect(logger.info).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining("logged in"),
      );
    });

    test("should throw InvalidCredentialsError if no user found with login", async () => {
      // Arrange
      repository.findByLogin.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.login({
          login: "user@gmail.com",
          password: "password",
        }),
      ).rejects.toThrow(InvalidCredentialsError);

      expect(repository.findByLogin).toHaveBeenCalledWith("user@gmail.com");
      expect(passwordService.verify).not.toHaveBeenCalled();
      expect(tokenService.signAccessToken).not.toHaveBeenCalled();
    });

    test("should throw InvalidCredentialsError if password not match", async () => {
      // Arrange
      repository.findByLogin.mockResolvedValue({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
        password: "hashedPassword",
        createdAt: date,
        updatedAt: date,
      });
      passwordService.verify.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.login({
          login: "user@gmail.com",
          password: "password",
        }),
      ).rejects.toThrow(InvalidCredentialsError);

      expect(repository.findByLogin).toHaveBeenCalledWith("user@gmail.com");
      expect(passwordService.verify).toHaveBeenCalledWith("password", "hashedPassword");
      expect(tokenService.signAccessToken).not.toHaveBeenCalled();
    });

  });

  describe("me", () => {

    test("should return me", async () => {
      // Arrange
      repository.findById.mockResolvedValue({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
      });

      // Act
      const result = await service.me("user-id");

      expect(repository.findById).toHaveBeenCalledWith("user-id");
      expect(result).toStrictEqual({
        id: "user-id",
        email: "user@gmail.com",
        username: "username",
      })
    });

  });
});