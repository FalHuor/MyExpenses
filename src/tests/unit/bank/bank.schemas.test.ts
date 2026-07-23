import { expect, test, describe } from "vitest";
import { CreateBankSchema, UpdateBankSchema, BankParamsSchema } from "../../../modules/bank/bank.schemas";

describe("BankSchemas", () => {

  describe("CreateBankSchema", () => {
    test("Should accept a valid bank", () => {

      const result = CreateBankSchema.safeParse({
        name: "Revolut",
      });

      expect(result.success).toBe(true);
    });

    test("Should reject an empty name", () => {

      const result = CreateBankSchema.safeParse({
        name: "",
      });

      expect(result.success).toBe(false);
    });

  });

  describe("UpdateBankSchema", () => {
    test("Should accept a valid bank", () => {
      
      const result = UpdateBankSchema.safeParse({
        name: "Revolut",
      });

      expect(result.success).toBe(true);
    });

    test("Should reject an empty name", () => {
      const result = UpdateBankSchema.safeParse({
        name: "Revolut",
      });

      expect(result.success).toBe(true);
    });

  });

  describe("BankParamsSchema", () => {
    test("Should accept a valid id", () => {
      const result = BankParamsSchema.safeParse({
        bankId: "2dfb714a-7732-41ba-9424-1b155b6da4b4",
      });

      expect(result.success).toBe(true);
    });

    test("Should reject an empty name", () => {
      const result = BankParamsSchema.safeParse({
        bankId: "",
      });

      expect(result.success).toBe(false);
    });

  });
});