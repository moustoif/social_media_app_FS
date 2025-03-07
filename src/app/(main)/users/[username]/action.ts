"use server" ;

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
    const validateValues = updateUserProfileSchema.parse(values);

    const { user } = await validateRequest(); 

    if(!user) throw new Error("Unauthorized");

    const updateUser = await prisma.$transaction(async (tx) => {
        const updateUser = await tx.user.update({
            where: { id: user.id},
            data : validateValues,
            select: getUserDataSelect(user.id),
        });
        await streamServerClient.partialUpdateUser({
            id: user.id,
            set: {
                name: validateValues.displayName,
            },
        });
        return updateUser;
    });
    
    return updateUser;
}