import { z } from "zod";

export const signupSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  pseudo: z.string().min(1, "Le pseudo est requis"),
  email: z.email("L'email est invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  passwordConfirmation: z.string().min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirmation"],
});

export type SignupSchema = z.infer<typeof signupSchema>;
