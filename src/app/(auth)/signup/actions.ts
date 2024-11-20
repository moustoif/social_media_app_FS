"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    // Utilisation de parseAsync pour gérer les validations asynchrones
    const { username, email, password } = await signUpSchema.parseAsync(credentials);

    // Vérification que l'email correspond à un étudiant via l'API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/etudiants/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Invalid student email" };
    }

    // Hachage du mot de passe
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    // Vérification si le username existe déjà
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    // Vérification si l'email existe déjà dans la table User
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // Création de l'utilisateur et transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
    });

    // Création de la session utilisateur
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}


/* "use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    const { username, email, password } = signUpSchema.parseAsync(credentials);

    // Vérification que l'email correspond à un étudiant via l'API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/etudiants/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Invalid student email" };
    }

    // Hachage du mot de passe
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    // Vérification si le username existe déjà
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    // Vérification si l'email existe déjà dans la table User
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // Création de l'utilisateur et transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
    });

    // Création de la session utilisateur
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
 */

/* "use server"

import { lucia } from '@/auth';
import prisma from '@/lib/prisma';
import { signUpSchema, SignUpValues} from '@/lib/validation';
import {hash} from "argon2";
import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(
    credentials: SignUpValues
): Promise<{error: string}> {
    try {
        const {username, email, password} = signUpSchema.parse(credentials);

        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            parallelism : 1
        })

        const userId = generateIdFromEntropySize(10);

        const existingUsername = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                }
            }
        })

        if (existingUsername) {
            return {
                error: "Username already taken"
            }
        }

        const existingEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                },
            },
        });

        if(existingEmail) {
            return {
                error: "Email already taken",
            };
        }

        await prisma.user.create({
            data: {
                id : userId,
                username,
                email,
                passwordHash,
            },
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

    return redirect("/");
    } catch (error) {
        console.error(error);
        return {
            error: "Something went wrong. Please try again."
        }
    }
} */