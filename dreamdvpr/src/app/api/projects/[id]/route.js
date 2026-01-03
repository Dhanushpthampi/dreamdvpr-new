import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { logAction } from "@/app/lib/logger";

// GET - Get single project
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Project ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check authorization
        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (project.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        // Get client info
        const clientInfo = await db.collection("users").findOne(
            { _id: project.clientId },
            { projection: { password: 0 } }
        );

        return NextResponse.json({
            project: {
                ...project,
                _id: project._id.toString(),
                clientId: project.clientId.toString(),
                client: clientInfo,
            }
        });

    } catch (error) {
        console.error('Get project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update project
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Project ID' }, { status: 400 });
        }
        const data = await request.json();
        const { name, description, status, estimatedEndDate, actualEndDate, budget } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const updateData = {
            updatedAt: new Date(),
        };

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (estimatedEndDate) updateData.estimatedEndDate = new Date(estimatedEndDate);
        if (actualEndDate) updateData.actualEndDate = new Date(actualEndDate);
        if (budget !== undefined) updateData.budget = budget;

        const result = await db.collection("projects").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        await logAction({
            action: 'Project Updated',
            userId: session.user.id,
            userName: session.user.name,
            targetId: id,
            details: `Updated project status/details: ${status || 'metadata updated'}`,
            type: 'info'
        });

        return NextResponse.json({
            success: true,
            message: 'Project updated successfully'
        });

    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete project
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Project ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Also delete related timeline events, files, and meetings
        await db.collection("timeline_events").deleteMany({ projectId: new ObjectId(id) });
        await db.collection("shared_files").deleteMany({ projectId: new ObjectId(id) });
        await db.collection("meetings").deleteMany({ projectId: new ObjectId(id) });

        await logAction({
            action: 'Project Deleted',
            userId: session.user.id,
            userName: session.user.name,
            targetId: id,
            details: `Permanently deleted project and all associated records`,
            type: 'warning'
        });

        return NextResponse.json({
            success: true,
            message: 'Project deleted successfully'
        });

    } catch (error) {
        console.error('Delete project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
