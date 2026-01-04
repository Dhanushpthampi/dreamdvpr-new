import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { logAction } from "@/app/lib/logger";

// GET - List all projects (filtered by role)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        let query = {};

        // Clients can only see their own projects
        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            query = { clientId: user._id };
        }
        // Admins can see all projects

        const projects = await db.collection("projects")
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        // Populate client information
        const projectsWithClients = await Promise.all(
            projects.map(async (project) => {
                const client = await db.collection("users").findOne(
                    { _id: project.clientId },
                    { projection: { password: 0 } }
                );
                return {
                    ...project,
                    _id: project._id.toString(),
                    clientId: project.clientId.toString(),
                    client,
                };
            })
        );

        return NextResponse.json({ projects: projectsWithClients });

    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new project
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        const data = await request.json();
        const { name, description, clientId: providedClientId } = data;

        if (!providedClientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const clientId = new ObjectId(providedClientId);
        const targetClient = await db.collection("users").findOne({ _id: clientId });

        if (!targetClient) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const project = {
            clientId,
            name,
            description,
            status: 'pending',
            startDate: new Date(),
            estimatedEndDate: null,
            actualEndDate: null,
            budget: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("projects").insertOne(project);

        await logAction({
            action: 'Project Created',
            userId: session.user.id,
            userName: session.user.name,
            targetId: result.insertedId,
            targetName: name,
            details: `Admin created project "${name}" for client ${targetClient.name}`,
            type: 'info'
        });

        return NextResponse.json({
            success: true,
            projectId: result.insertedId.toString(),
            message: 'Project created successfully'
        });

    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
