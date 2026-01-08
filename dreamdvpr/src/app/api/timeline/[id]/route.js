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

        const currentEvent = await db.collection("timeline_events").findOne({ _id: new ObjectId(id) });
        if (!currentEvent) {
            return NextResponse.json({ error: 'Timeline event not found' }, { status: 404 });
        }

        const result = await db.collection("timeline_events").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        // Cascading updates if status is changed to completed
        if (status === 'completed') {
            const projectId = currentEvent.projectId;

            // 1. Mark all previous events as completed
            // Previous events are those with smaller 'order' or same order and earlier 'dueDate'
            await db.collection("timeline_events").updateMany(
                {
                    projectId: projectId,
                    $or: [
                        { order: { $lt: currentEvent.order } },
                        { order: currentEvent.order, dueDate: { $lt: currentEvent.dueDate } },
                        { order: currentEvent.order, dueDate: currentEvent.dueDate, createdAt: { $lt: currentEvent.createdAt } }
                    ],
                    status: { $ne: 'completed' }
                },
                {
                    $set: {
                        status: 'completed',
                        completedDate: new Date(),
                        updatedAt: new Date()
                    }
                }
            );

            // 2. Mark the immediate NEXT event as in-progress
            // Next event is the one with the smallest 'order' or 'dueDate' after the current one
            const nextEvent = await db.collection("timeline_events")
                .find({
                    projectId: projectId,
                    $or: [
                        { order: { $gt: currentEvent.order } },
                        { order: currentEvent.order, dueDate: { $gt: currentEvent.dueDate } },
                        { order: currentEvent.order, dueDate: currentEvent.dueDate, createdAt: { $gt: currentEvent.createdAt } }
                    ],
                    status: 'pending'
                })
                .sort({ order: 1, dueDate: 1, createdAt: 1 })
                .limit(1)
                .toArray();

            if (nextEvent.length > 0) {
                await db.collection("timeline_events").updateOne(
                    { _id: nextEvent[0]._id },
                    {
                        $set: {
                            status: 'in-progress',
                            updatedAt: new Date()
                        }
                    }
                );
            }

            // 3. Update project status based on overall timeline progress
            const allEvents = await db.collection("timeline_events")
                .find({ projectId: projectId })
                .toArray();

            const totalCount = allEvents.length;
            const completedCount = allEvents.filter(e => e.status === 'completed').length;

            let newProjectStatus = null;
            if (completedCount === totalCount && totalCount > 0) {
                newProjectStatus = 'completed';
            } else if (completedCount > 0) {
                newProjectStatus = 'in-progress';
            }

            if (newProjectStatus) {
                await db.collection("projects").updateOne(
                    { _id: projectId },
                    {
                        $set: {
                            status: newProjectStatus,
                            updatedAt: new Date()
                        }
                    }
                );
            }
        }

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
