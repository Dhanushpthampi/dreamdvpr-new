import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PUT - Update timeline event (admin only)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();
        const { title, description, status, dueDate, completedDate, order } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const updateData = {
            updatedAt: new Date(),
        };

        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status) {
            updateData.status = status;
            // Auto-set completed date if status is completed
            if (status === 'completed' && !completedDate) {
                updateData.completedDate = new Date();
            }
        }
        if (dueDate) updateData.dueDate = new Date(dueDate);
        if (completedDate) updateData.completedDate = new Date(completedDate);
        if (order !== undefined) updateData.order = order;

        const result = await db.collection("timeline_events").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Timeline event not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Timeline event updated successfully'
        });

    } catch (error) {
        console.error('Update timeline event error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete timeline event (admin only)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const result = await db.collection("timeline_events").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Timeline event not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Timeline event deleted successfully'
        });

    } catch (error) {
        console.error('Delete timeline event error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
