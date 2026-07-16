import { expect, test, describe } from "vitest";
import { LoginSchema, RegisterSchema } from "../../../modules/auth/auth.schemas";

describe("BankSchemas", () => {

  describe("RegisterSchema", () => {

    test("Should accept a valid payload", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "2DoszjQA54",
      });

      expect(result.success).toBe(true);
    });

    test("Should reject an invalid email", () => {

      const result = RegisterSchema.safeParse({
        email: "jeandujardin",
        password: "2DoszjQA54",
      });

      expect(result.success).toBe(false);
    });

    test("Should reject an empty email", () => {

      const result = RegisterSchema.safeParse({
        email: "",
        password: "2DoszjQA54",
      });

      expect(result.success).toBe(false);
    });

    test("Should reject an empty password", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "",
      });

      expect(result.success).toBe(false);
    });

    test("Should reject a password too short", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "azA9tyu",
      });

      expect(result.success).toBe(false);
    });

    test("Should reject a password too long", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "aqwsdhcnfDZgpr2548oshjqndufzdzq",
      });

      expect(result.success).toBe(false);
    });

    test("Should reject a password which not contain upper case", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "dzqdzqfzq45",
      });

      expect(result.success).toBe(false);
    });

    test("Should reject a password which not contain lower case", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "SZFDZZF5DZQ",
      });

      expect(result.success).toBe(false);
    });

    test("Should reject a password which not contain number", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "defeDfdeDSDZQ",
      });

      expect(result.success).toBe(false);
    });

    test("Should accept a username", () => {

      const result = RegisterSchema.safeParse({
        email: "alex@gmail.com",
        password: "defeD2fdeDSDZQ",
        username: "jean"
      });

      expect(result.success).toBe(true);
    });

  });

  describe("LoginSchema", () => {

    test("Should accept a valid payload with email", () => {

      const result = LoginSchema.safeParse({
        login: "alex@gmail.com",
        password: "defeD2fdeDSDZQ",
      });

      expect(result.success).toBe(true);
    });

    test("Should accept a valid payload with username", () => {

      const result = LoginSchema.safeParse({
        login: "alex",
        password: "defeD2fdeDSDZQ",
      });

      expect(result.success).toBe(true);
    });

    test("Should reject an empty password", () => {

      const result = LoginSchema.safeParse({
        login: "alex",
        password: "",
      });

      expect(result.success).toBe(false);
    });

  });

});