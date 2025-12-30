import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET - Get current user profile with onboarding status
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const user = await db.collection("users").findOne(
            { email: session.user.email },
            { projection: { password: 0 } }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                ...user,
                _id: user._id.toString(),
            }
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
