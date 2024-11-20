import { z } from "zod";
import ky from "ky";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z
  .object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters"),
  })
  .superRefine(async (data, ctx) => {
    try {
      // Utilise une URL complète pour l'appel API
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Défaut si la variable d'environnement est absente
      const response = await ky
        .post(`${baseUrl}/api/etudiants/check`, { json: { email: data.email } })
        .json<{ exists: boolean }>();

      if (!response.exists) {
        ctx.addIssue({
          path: ["email"],
          message: "Cet email ne correspond à aucun étudiant enregistré.",
          code:"custom",
        });
      }
    } catch (error) {
      console.error("Erreur de validation de l'étudiant:", error);
      ctx.addIssue({
        path: ["email"],
        message: "Erreur lors de la vérification de l'étudiant.",
        code:"custom",
      });
    }
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 caracters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;



/* import { z } from "zod";
import ky from "ky"; // Assure-toi d'avoir installé `ky`

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z
  .object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters"),
  })
  .superRefine(async (data, ctx) => {
    try {
      // Appelle l'endpoint pour vérifier l'existence de l'étudiant
      const response = await ky
        .post("/api/etudiants/check", { json: { email: data.email } })
        .json<{ exists: boolean }>();

      if (!response.exists) {
        ctx.addIssue({
          path: ["email"],
          message: "Cet email ne correspond à aucun étudiant enregistré.",
          code:"custom",
        });
      }
    } catch (error) {
      console.error("Erreur de validation de l'étudiant:", error);
      ctx.addIssue({
        path: ["email"],
        message: "Erreur lors de la vérification de l'étudiant.",
        code:"custom",
      });
    }
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
});
 */


/* import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
}).superRefine(async (data, ctx) => {
  // Vérification de la correspondance de l'email dans le modèle Etudiants
  const etudiant = await prisma.etudiants.findUnique({
    where: { email: data.email },
  });

  if (!etudiant) {
    ctx.addIssue({
        path: ["email"],
        message: "Cet email ne correspond à aucun étudiant enregistré.",
        code: "custom"
    });
  }
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, - and _ allowed"
  ),
  password: requiredString.min(8, "Must be at least 8 characters")
});

export type LoginValues = z.infer<typeof loginSchema>;


export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
})
 */

/* import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters")
});

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters")
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
    content: z.string().min(1, "Content is required"),
}) */