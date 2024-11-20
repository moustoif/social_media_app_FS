"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";


export async function submitPost(input: string) {
    const { user } = await validateRequest();

    if (!user) throw new Error("Unauthorized");

    const { content } = createPostSchema.parse({ content: input });

    // Création du post et récupération de son ID
    const newPost = await prisma.post.create({
        data: {
            content,
            userId: user.id,
        },
        include: getPostDataInclude(user.id),
    });
    
    // Extraction des hashtags du contenu
    const hashtags = (content.match(/#[\w]+/g) || []).map(tag => tag.toLowerCase());
    if (hashtags.length > 0) {
    // Insertion des hashtags dans la table `Hashtag`
    await prisma.hashtag.createMany({
        data: hashtags.map(hashtag => ({
            hashtag,
            postId: newPost.id, // Utilisation de `post.id` récupéré de la création du post
        })),
        skipDuplicates: true, // Évite les doublons
    });

    console.log("Hashtags créés:", hashtags);
  } else {
    console.log("No hashtags found in the posts ! ");
  }

  return newPost;
}






/* 
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation";


export async function submitPost(input: string) {
    const {user} = await validateRequest();

    if (!user) throw new Error("Unauthorized");

    const { content } = createPostSchema.parse({ content : input });

    await prisma.post.create({
        data: {
            content, 
            userId : user.id,
        },
    });

    // Extraction des hashtags du contenu
    const hashtags = (content.match(/#[\w]+/g) || []).map(tag => tag.toLowerCase());

    // Insertion des hashtags dans la table `Hashtag`
    await prisma.hashtag.createMany({
        data: hashtags.map(hashtag => ({
            hashtag,
            postId: post.id,
        })),
        skipDuplicates: true, // Évite les doublons
    });
} */