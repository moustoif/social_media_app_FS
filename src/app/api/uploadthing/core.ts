import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import {createUploadthing, FileRouter} from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server"; 

const f = createUploadthing();

export const fileRouter = {
    avatar: f({
        image: { maxFileSize: "512KB"}
    })
    .middleware(async ({req}) => {
        const url = new URL(req.url);
        console.log("Incoming Request: ", req.method);
        console.log("Headers: ", req.headers);
    
        // Extraction des paramètres
        const actionType = url.searchParams.get("actionType");
        const slug = url.searchParams.get("slug");
    
        console.log("Middleware received actionType:", actionType);
        console.log("Middleware received slug:", slug);
    
        if (!actionType || !slug) {
          throw new Error("Missing required parameters: actionType or slug");
        }
        // Vous pouvez ajouter des validations spécifiques ici
        if (slug !== "avatar") {
          throw new Error("Invalid slug value. Expected 'avatar'.");
        }

        const {user} = await validateRequest();

        if (!user) throw new UploadThingError("Unauthorized");
        console.log("Middleware metadata:", { user });

        return { user };
    })
    .onUploadComplete(async ({ metadata, file}) => {
        try {

            console.log(`Upload complete for user ${metadata.user.id}: ${file.url}`);
            console.log("File received: ", file); // Inspecter les informations du fichier reçu
            console.log("Metadata: ", metadata); // Inspecter les métadonnées associées
            
            const oldAvatarUrl = metadata.user.profilePicture;
    
            if (oldAvatarUrl) {
                 const key = oldAvatarUrl.split(
                    `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
                 )[1];
    
                 await new UTApi().deleteFiles(key);
            }
            const newAvatarUrl = file.url.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            );

            await Promise.all([
                await prisma.user.update({
                    where: { id: metadata.user.id },
                    data: {
                        profilePicture: newAvatarUrl,
                    },
                }),
                streamServerClient.partialUpdateUser({
                    id: metadata.user.id,
                    set: {
                        image: newAvatarUrl,
                    },
                }),
            ]);
    
            console.log("User profile picture updated:", newAvatarUrl)
            return {profilePicture: newAvatarUrl}
        }
            
        catch (error) {
            console.error("Error during file processing: ", error);
            throw new Error("Upload processing failed");
        }
    }),
    attachment : f({
        image: {maxFileSize: "4MB", maxFileCount: 5 },
        video: {maxFileSize: "128MB", maxFileCount: 5}
    })
    .middleware(async () => {
        const {user} = await validateRequest();

        if (!user) throw new UploadThingError("Unauthorized");

        return { }
    })
    .onUploadComplete(async ({file}) => {
        const media = await prisma.media.create({
            data: {
                url: file.url.replace(
                    "/f/",
                    `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
                ),
                type: file.type.startsWith("image") ? "IMAGE" : "VIDEO"
            }
        });
        
        return { mediaId: media.id };
    }),
} satisfies FileRouter;

console.log("UPLOADTHING_TOKEN:", process.env.UPLOADTHING_TOKEN)
export type AppFileRouter = typeof fileRouter;
