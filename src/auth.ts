import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import prisma from "./lib/prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/dist/server/request/cookies";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path:"/",
        },
    },
    getUserAttributes(databaseUserAttributes) {
        return {
            id: databaseUserAttributes.id,
            username: databaseUserAttributes.username,
            displayName: databaseUserAttributes.displayName,
            profilePicture: databaseUserAttributes.profilePicture,
        }
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    id : string,
    username : string,
    displayName : string,
    profilePicture : string|null,
    }

export const validateRequest = cache(
    async (): Promise<
        { user: User; session: Session } | { user: null; session: null }
    > => {
        const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

        if (!sessionId) {
            return {
                user: null,
                session: null
            }
        }
        const result = await lucia.validateSession(sessionId);
        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                (await cookies()).set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                )
            }
            if (!result.session) {
                const blankCookie = lucia.createBlankSessionCookie();
                (await cookies()).set(
                    blankCookie.name,
                    blankCookie.value,
                    blankCookie.attributes
                );
                return {
                    user: null,
                    session: null
                };
            }
            
            /* if(!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                (await cookies()).set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes,
                );
            } */
        } catch {}

        return result;
    },
);