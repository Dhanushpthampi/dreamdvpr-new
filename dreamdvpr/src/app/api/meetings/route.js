import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - List meetings
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        let query = {};

        if (projectId) {
            query.projectId = new ObjectId(projectId);
        }

        // Clients can only see their own meetings
        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            query.clientId = user._id;
        }

        const meetings = await db.collection("meetings")
            .find(query)
            .sort({ scheduledDate: 1 })
            .toArray();

        const meetingsWithIds = meetings.map(meeting => ({
            ...meeting,
            _id: meeting._id.toString(),
            clientId: meeting.clientId.toString(),
            projectId: meeting.projectId?.toString(),
        }));

        return NextResponse.json({ meetings: meetingsWithIds });

    } catch (error) {
        console.error('Get meetings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Schedule meeting
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { projectId, type, scheduledDate, scheduledTime, duration, notes, clientId: providedClientId } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        let clientId;

        // If admin is scheduling, they provide clientId
        // If client is scheduling, use their own ID
        if (session.user.role === 'admin' && providedClientId) {
            clientId = new ObjectId(providedClientId);
        } else {
            const user = await db.collection("users").findOne({ email: session.user.email });
            clientId = user._id;
        }

        const meeting = {
            clientId,
            projectId: projectId ? new ObjectId(projectId) : null,
            type: type || 'strategy',
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            duration: duration || 60,
            status: 'scheduled',
            notes: notes || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("meetings").insertOne(meeting);

        return NextResponse.json({
            success: true,
            meetingId: result.insertedId.toString(),
            message: 'Meeting scheduled successfully'
        });

    } catch (error) {
        console.error('Schedule meeting error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
