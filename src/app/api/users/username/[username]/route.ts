import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export async function GET(req: Request, props: { params : Promise<{ username: string}> }) {
    const params = await props.params;

    const {
        username
    } = params;

    try {
        const {user: loggedInUser} = await validateRequest();

        if (!loggedInUser) {
            return Response.json({ error : "Unauthorized"}, { status: 401});
        }
        const normalizedUsername = username.toLowerCase();
        
        const user = await prisma.user.findFirst({
            where: {
                username: normalizedUsername,
            },
            select: getUserDataSelect(loggedInUser.id),
        });

        if (!user) {
            return Response.json({ error: "Unauthorized"}, {status:401});
        }
        
        return Response.json(user);
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error"}, { status: 500});
    }
}