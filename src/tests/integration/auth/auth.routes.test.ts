import { test, describe, beforeEach, expect, beforeAll, afterAll } from "vitest";
import { testDependencies } from "../helpers/dependecies";

import { createTestApp } from "../helpers/createTestApp";
import { cleanDatabase } from "../helpers/database";
import { createUser } from "../helpers/factory/user.factory";
import { authenticate } from "../helpers/authenticate";

const app = await createTestApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  await cleanDatabase();
});

describe("AuthRoutes", () => {

  describe("POST /auth/register", () => {

    test("should create a user with a complete payload", async () => {

      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "alex@test.com",
          username: "alex",
          password: "Password123",
        },
      });

      const body = response.json();

      expect(body.id).toBeDefined();
      expect(body.email).toBe("alex@test.com");
      expect(body).not.toHaveProperty("password");

      expect(response.statusCode).toBe(201);

      const user = await testDependencies.prisma.user.findUnique({
        where: {
          email: "alex@test.com",
        },
      });

      expect(user).not.toBeNull();
      expect(user?.username).toBe("alex");

    });

    test("should return 409 when email is already used", async () => {

      await createUser(testDependencies.prisma, { email: "alex@test.com" });
      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "alex@test.com",
          username: "alex",
          password: "Password123",
        },
      });

      const body = response.json();

      expect(body.id).not.toBeDefined();
      expect(response.statusCode).toBe(409);

    });

    test("should return error when password is invalid", async () => {

      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "alex@test.com",
          username: "alex",
          password: "password",
        },
      });

      const user = await testDependencies.prisma.user.findUnique({
        where: {
          email: "alex@test.com",
        },
      });

      const body = response.json();

      expect(body.id).not.toBeDefined();
      expect(response.statusCode).toBe(400);
    });
  

    test("should return error when email is invalid", async () => {

      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "alex.test.com",
          username: "alex",
          password: "Password123",
        },
      });

      const user = await testDependencies.prisma.user.findUnique({
        where: {
          username: "alex",
        },
      });

      const body = response.json();

      expect(body.id).not.toBeDefined();
      expect(response.statusCode).toBe(400);
    });

    test("should create a user without username", async () => {

      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "alex@test.com",
          password: "Password123",
        },
      });

      const body = response.json();

      expect(body.id).toBeDefined();
      expect(body.email).toBe("alex@test.com");
      expect(body).not.toHaveProperty("password");

      expect(response.statusCode).toBe(201);

      const user = await testDependencies.prisma.user.findUnique({
        where: {
          email: "alex@test.com",
        },
      });

      expect(user).not.toBeNull();
      expect(user?.username).toBe(null);
    });
  });

  describe("POST /auth/login", () => {

    test("should login with email & password", async () => {
      await createUser(
        testDependencies.prisma, 
        { email: "alex@test.com", username: "alex", password: "Password123" }
      );
      
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          login: "alex@test.com",
          password: "Password123",
        },
      });

      const body = response.json();

      expect(body.accessToken).toBeDefined();
      expect(body).not.toHaveProperty("password");

      expect(response.statusCode).toBe(200);
    });

    test("should login with username & password", async () => {
      await createUser(
        testDependencies.prisma, 
        { email: "alex@test.com", username: "alex", password: "Password123" }
      );
      
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          login: "alex",
          password: "Password123",
        },
      });

      const body = response.json();

      expect(body.accessToken).toBeDefined();
      expect(body).not.toHaveProperty("password");

      expect(response.statusCode).toBe(200);
    });

    test("should throw 401 with wrong password", async () => {
      await createUser(
        testDependencies.prisma, 
        { email: "alex@test.com", username: "alex", password: "Password123" }
      );
      
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          login: "alex@test.com",
          password: "Password1",
        },
      });

      const body = response.json();

      expect(body.accessToken).not.toBeDefined();

      expect(response.statusCode).toBe(401);
    });

    test("should throw 401 with unknown user", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          login: "alex@test.com",
          password: "Password123",
        },
      });

      const body = response.json();

      expect(body.accessToken).not.toBeDefined();

      expect(response.statusCode).toBe(401);
    });

  });

  describe("POST /auth/me", () => {

    test("should return user with valid token", async () => {
      const { user, token } = await authenticate();

      const response = await app.inject({
        method: "GET",
        url: "/auth/me",
        headers: {
          authorization: `Bearer ${token}`,
        },
        
      });

      const body = response.json();

      expect(body.accessToken).not.toBeDefined();

      expect(response.statusCode).toBe(200);
      expect(body?.email).toStrictEqual(user.email);

    });

    test("should reject request without token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/auth/me",
      });

      expect(response.statusCode).toBe(401);

    });

    test("should reject invalid token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/auth/me",
        headers: {
          authorization: "Bearer invalid-token",
        },
      });

      expect(response.statusCode).toBe(401);
    });

  });
})