import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  companySlug: z
    .string()
    .min(3, 'Le slug doit contenir au moins 3 caractères')
    .regex(/^[a-z0-9-]+$/, 'Uniquement des lettres minuscules, chiffres et tirets'),
  phoneNumber: z.string().optional(),
  modules: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
