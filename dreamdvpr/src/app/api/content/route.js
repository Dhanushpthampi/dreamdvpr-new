import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { DEFAULT_CONTENT } from "@/app/lib/content";

// GET - Get homepage content
export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const content = await db.collection("homepage_content").findOne({ type: 'homepage' });

        if (!content) {
            // Return default content from constants
            return NextResponse.json({ content: DEFAULT_CONTENT });
        }

        return NextResponse.json({ content: content.data });

    } catch (error) {
        console.error('Get content error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update homepage content (admin only)
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const result = await db.collection("homepage_content").updateOne(
            { type: 'homepage' },
            {
                $set: {
                    type: 'homepage',
                    data: data,
                    updatedAt: new Date(),
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Content updated successfully'
        });

    } catch (error) {
        console.error('Update content error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
