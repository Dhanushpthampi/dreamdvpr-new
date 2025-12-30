import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Get single blog
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({
            blog: {
                ...blog,
                _id: blog._id.toString(),
            }
        });

    } catch (error) {
        console.error('Get blog error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update blog (admin only)
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const updateData = {
            ...data,
            updatedAt: new Date(),
        };

        const result = await db.collection("blogs").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Blog updated successfully'
        });

    } catch (error) {
        console.error('Update blog error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete blog (admin only)
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Blog deleted successfully'
        });

    } catch (error) {
        console.error('Delete blog error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
