import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("L'email est invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis"),
})

export type loginSchema = z.infer<typeof loginSchema>;
