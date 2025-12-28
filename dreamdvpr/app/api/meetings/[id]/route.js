import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PUT - Update/reschedule meeting
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const data = await request.json();
        const { scheduledDate, scheduledTime, status, notes, duration } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        // Verify user has access to this meeting
        const meeting = await db.collection("meetings").findOne({ _id: new ObjectId(id) });

        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (meeting.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        const updateData = {
            updatedAt: new Date(),
        };

        if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);
        if (scheduledTime) updateData.scheduledTime = scheduledTime;
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;
        if (duration) updateData.duration = duration;

        const result = await db.collection("meetings").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return NextResponse.json({
            success: true,
            message: 'Meeting updated successfully'
        });

    } catch (error) {
        console.error('Update meeting error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Cancel meeting
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        // Verify user has access to this meeting
        const meeting = await db.collection("meetings").findOne({ _id: new ObjectId(id) });

        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (meeting.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        const result = await db.collection("meetings").deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            success: true,
            message: 'Meeting cancelled successfully'
        });

    } catch (error) {
        console.error('Delete meeting error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
