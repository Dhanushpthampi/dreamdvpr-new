import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Get timeline events for a project
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        // Verify user has access to this project
        const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (project.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        const events = await db.collection("timeline_events")
            .find({ projectId: new ObjectId(projectId) })
            .sort({ order: 1, createdAt: 1 })
            .toArray();

        const eventsWithIds = events.map(event => ({
            ...event,
            _id: event._id.toString(),
            projectId: event.projectId.toString(),
            createdBy: event.createdBy?.toString(),
        }));

        return NextResponse.json({ events: eventsWithIds });

    } catch (error) {
        console.error('Get timeline events error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create timeline event (admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { projectId, title, description, status, dueDate, order } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const user = await db.collection("users").findOne({ email: session.user.email });

        const event = {
            projectId: new ObjectId(projectId),
            title,
            description: description || '',
            status: status || 'pending',
            dueDate: dueDate ? new Date(dueDate) : null,
            completedDate: null,
            order: order || 0,
            createdBy: user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("timeline_events").insertOne(event);

        return NextResponse.json({
            success: true,
            eventId: result.insertedId.toString(),
            message: 'Timeline event created successfully'
        });

    } catch (error) {
        console.error('Create timeline event error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
