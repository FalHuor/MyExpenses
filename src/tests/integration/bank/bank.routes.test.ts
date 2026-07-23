import { test, describe, beforeEach, expect, beforeAll, afterAll } from "vitest";
import { testDependencies } from "../helpers/dependecies";

import { createTestApp } from "../helpers/createTestApp";
import { cleanDatabase } from "../helpers/database";
import { createUser } from "../helpers/factory/user.factory";
import { authenticate } from "../helpers/authenticate";
import { createBank } from "../helpers/factory/bank.factory";

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

describe("BankRoutes", () => {

  describe("POST /banks", () => {

    test("should create a bank", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const response = await app.inject({
        method: "POST",
        url: "/banks",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: "Revolut"
        },
      });

      const body = response.json();
      expect(body.id).toBeDefined();
      expect(response.statusCode).toBe(201);

      const bank = await testDependencies.prisma.bank.findFirst({
        where: {
          name: "Revolut"
        }
      });

      expect(body.id).toStrictEqual(bank?.id);
      expect(bank?.userId).toStrictEqual(user.id);
    });

    test("should throw 409 with an already used bank name", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });
      const response = await app.inject({
        method: "POST",
        url: "/banks",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: "Revolut"
        },
      });

      const body = response.json();

      expect(response.statusCode).toBe(409);
    });

    test("should throw 401 without authenticate", async () => {

      const response = await app.inject({
        method: "POST",
        url: "/banks",
        payload: {
          name: "Revolut"
        },
      });

      expect(response.statusCode).toBe(401);
    });

    test("should throw 400 with an empty bank name", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const response = await app.inject({
        method: "POST",
        url: "/banks",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: ""
        },
      });

      expect(response.statusCode).toBe(400);
    });

  });

  describe("GET /banks", () => {

    test("should only return banks of the current user", async () => {

      const otherUser = await createUser(testDependencies.prisma, { username: "klawax", email: "klawax@test.com" });
      const bank1 = await createBank(testDependencies.prisma, otherUser.id, { name: "BNP" });
      const bank2 = await createBank(testDependencies.prisma, otherUser.id, { name: "CIC" });

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank3 = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });
      const bank4 = await createBank(testDependencies.prisma, user.id, { name: "Credit mutuel" });
      const bank5 = await createBank(testDependencies.prisma, user.id, { name: "N26" });
      const response = await app.inject({
        method: "GET",
        url: "/banks",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const body = response.json();
      expect(response.statusCode).toBe(200);
      expect(body).length(3);

      expect(body[0].name).toBe("Revolut");
      expect(body[1].name).toBe("Credit mutuel");
      expect(body[2].name).toBe("N26");
    });

  });

  describe("GET /banks/:id", () => {

    test("should return a bank", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });

      const response = await app.inject({
        method: "GET",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },

      });

      const body = response.json();
      expect(response.statusCode).toBe(200);

      expect(body.name).toBe("Revolut");
      expect(body.userId).toBe(user.id);
    });

    test("should throw 404 when bank not exist", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });

      const response = await app.inject({
        method: "GET",
        url: `/banks/${crypto.randomUUID()}`,
        headers: {
          authorization: `Bearer ${token}`,
        },

      });

      expect(response.statusCode).toBe(404);
    });

    test("should throw 403 with bank belongs to another user", async () => {
      const otherUser = await createUser(testDependencies.prisma, { username: "klawax", email: "klawax@test.com" });
      const bank = await createBank(testDependencies.prisma, otherUser.id, { name: "BNP" });

      const { user, token } = await authenticate({ email: "alex@test.com" });

      const response = await app.inject({
        method: "GET",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },

      });
      
      expect(response.statusCode).toBe(403);
    });

  });

  describe("PATCH /banks/:id", () => {

    test("should patch a bank", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });

      const response = await app.inject({
        method: "PATCH",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: "CIC"
        }
      });

      const body = response.json();
      expect(response.statusCode).toBe(200);

      expect(body.name).toBe("CIC");
      const updatedBank = await testDependencies.prisma.bank.findFirst({
        where: {
          id: bank.id
        }
      });
      expect(updatedBank?.name).toBe("CIC");
    });

    test("should throw 409 with a bank name already used", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank1 = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });
      const bank2 = await createBank(testDependencies.prisma, user.id, { name: "CIC" });

      const response = await app.inject({
        method: "PATCH",
        url: `/banks/${bank2.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: "Revolut"
        }
      });

      expect(response.statusCode).toBe(409);

    });

    test("should throw 403 with a bank belongs to another user", async () => {

      const otherUser = await createUser(testDependencies.prisma, { username: "klawax", email: "klawax@test.com" });
      const bank = await createBank(testDependencies.prisma, otherUser.id, { name: "BNP" });

      const { user, token } = await authenticate({ email: "alex@test.com" });

      const response = await app.inject({
        method: "PATCH",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: "Revolut"
        }
      });

      expect(response.statusCode).toBe(403);

    });

    test("should throw 400 with an empty name", async () => {
      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });

      const response = await app.inject({
        method: "PATCH",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: ""
        }
      });

      expect(response.statusCode).toBe(400);

    });

    test("should throw 400 with an empty bankId", async () => {
      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });

      const response = await app.inject({
        method: "PATCH",
        url: `/banks/`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: "CIC"
        }
      });

      expect(response.statusCode).toBe(400);

    });

  });

  describe("DELETE /banks/:id", () => {

    test("should delete a bank", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });

      const response = await app.inject({
        method: "DELETE",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });

      const body = response.json();
      expect(response.statusCode).toBe(200);

      expect(body.id).toBe(bank.id);
      const deletedBank = await testDependencies.prisma.bank.findFirst({
        where: {
          id: bank.id
        }
      });
      expect(deletedBank).toBeNull();
    });

    test("should throw 404 with a bank already deleted", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "Revolut" });
      await testDependencies.prisma.bank.delete({
        where: {
          id: bank.id
        }
      });

      const response = await app.inject({
        method: "DELETE",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });

      expect(response.statusCode).toBe(404);
    });

    test("should throw 403 with a bank belongs to another user", async () => {

      const otherUser = await createUser(testDependencies.prisma, { username: "klawax", email: "klawax@test.com" });
      const bank = await createBank(testDependencies.prisma, otherUser.id, { name: "BNP" });

      const { user, token } = await authenticate({ email: "alex@test.com" });

      const response = await app.inject({
        method: "DELETE",
        url: `/banks/${bank.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });

      expect(response.statusCode).toBe(403);
      const deletedBank = await testDependencies.prisma.bank.findFirst({
        where: {
          id: bank.id
        }
      });
      expect(deletedBank).not.toBeNull();

    });

    test("should throw 400 with an empty bankId", async () => {

      const { user, token } = await authenticate({ email: "alex@test.com" });
      const bank = await createBank(testDependencies.prisma, user.id, { name: "BNP" });

      const response = await app.inject({
        method: "DELETE",
        url: `/banks/`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

});