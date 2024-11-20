// /src/app/api/etudiants/check/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Vérifie si un étudiant avec cet email existe
        const etudiant = await prisma.etudiants.findUnique({
            where: { email },
        });

        return NextResponse.json({ exists: !!etudiant });
    } catch (error) {
        console.error("Erreur lors de la vérification de l'étudiant:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
