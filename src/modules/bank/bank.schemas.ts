import * as z from "zod"; 

export const CreateSchema = z.object({
  name: z.string(),
});

export const GetOneSchema = z.object({
  id: z.string(),
});

export const DeleteSchema = z.object({
  id: z.string(),
});

export const UpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type BankCreateDto = z.infer<typeof CreateSchema>;
export type BankUpdateDto = z.infer<typeof UpdateSchema>;
export type BankGetOneDto = z.infer<typeof GetOneSchema>;
export type BankDeleteDto = z.infer<typeof DeleteSchema>;