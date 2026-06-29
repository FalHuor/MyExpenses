import * as z from "zod"; 

export const RegisterSchema = z.object({
  email: z.email(),
  username: z.string().optional(),
  password: z.string().min(8)
});

export const LoginSchema = z.object({
  login: z.string(),
  password: z.string().min(8)
})

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;