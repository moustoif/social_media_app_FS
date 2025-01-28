import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: { postId: string } },
) {
    const { params } = context; // Désestructuration explicite de `params`
    const { postId } = await params; // Désestructuration explicite de `postId`
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
        
        const pageSize = 5;

        const { user } = await validateRequest();

        if (!user) {
            return Response.json({error: "Unauthorized"}, {status: 401});
        }
        
        const comments = await prisma.comment.findMany({
            where: {postId},
            include: getCommentDataInclude(user.id),
            orderBy: {createdAt: "asc"},
            take: pageSize + 1,
            ...(cursor && { skip: 1, cursor: { id: cursor } }),
            //cursor: cursor ? { id: cursor } : undefined,
        });

        const previousCursor = comments.length > pageSize ? comments[0].id : null;
       
        const data: CommentsPage = {
            comments: comments.length > pageSize ? comments.slice(1) : comments,
            previousCursor,
        };

        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal sever error"})
    }
}