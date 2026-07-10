import * as z from "zod"; 

export const CreateBankSchema = z.object({
  name: z.string().trim(),
});

export const UpdateBankSchema = z.object({
  name: z.string().trim(),
});

export const BankParamsSchema = z.object({
  bankId: z.string(),
});

export type BankCreateDto = z.infer<typeof CreateBankSchema>;
export type BankUpdateDto = z.infer<typeof UpdateBankSchema>;
export type BankParamsDto  = z.infer<typeof BankParamsSchema>;