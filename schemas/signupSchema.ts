import { z } from "zod";

export const signupSchema = z.object({
  firstname: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastname: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  pseudo: z
    .string()
    .min(1, "Le pseudo est requis")
    .max(100, "Le pseudo ne peut pas dépasser 100 caractères"),
  email: z
    .email("L'email est invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(64, "Le mot de passe ne peut pas dépasser 64 caractères")
    .regex(/^\S+$/, "Le mot de passe ne doit pas contenir d'espaces")
    .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir un caractère spécial"),
  passwordConfirmation: z.string().min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirmation"],
});

export type SignupSchema = z.infer<typeof signupSchema>;
