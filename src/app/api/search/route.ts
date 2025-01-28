import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get("q") || " ";
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

        const searchQuery = q.trim();

        const pageSize = 10;

        const { user } = await validateRequest();

        if(!user) {
            return Response.json({ error: "unauthorized" }, { status: 401}); 
        }

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    {
                        content: {
                            contains: searchQuery,
                            
                        }
                    },
                    {
                        user: {
                            displayName: {
                                contains: searchQuery,
                            }
                        }
                    },
                    {
                        user: {
                            username: {
                                contains: searchQuery,
                            },
                         },
                    },
                ],
            },
            include: getPostDataInclude(user.id),
            orderBy: { createdAt: "desc"},
            take: pageSize + 1,
            cursor: cursor ? {id: cursor} : undefined,
        });

        const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data : PostsPage = { 
            posts : posts.slice(0, pageSize),
            nextCursor, 
        };

        return NextResponse.json(data);

    } catch (error) {
        console.error(error);
    return Response.json({error: "Internal server error"}, {status: 500});
    }
}