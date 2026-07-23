import * as z from "zod"; 

export const CreateBankSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const UpdateBankSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const BankParamsSchema = z.object({
  bankId: z.uuid(),
});

export type BankCreateDto = z.infer<typeof CreateBankSchema>;
export type BankUpdateDto = z.infer<typeof UpdateBankSchema>;
export type BankParamsDto = z.infer<typeof BankParamsSchema>;