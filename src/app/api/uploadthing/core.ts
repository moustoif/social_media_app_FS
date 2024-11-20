import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {createUploadthing, FileRouter} from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"; 

const f = createUploadthing();

export const fileRouter = {
    avatar: f({
        image: { maxFileSize: "512KB"}
    })
    .middleware(async () => {
        const {user} = await validateRequest();

        if (!user) throw new UploadThingError("Unauthorized");

        return { user };
    })
    .onUploadComplete(async ({ metadata, file}) => {
        const newProfilePicture = file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        );

        await prisma.user.update({
            where: { id: metadata.user.id },
            data: {
                profilePicture: newProfilePicture,
            },
        });

        return {profilePicture: newProfilePicture}
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;