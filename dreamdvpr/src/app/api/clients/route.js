import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { logAction } from "@/app/lib/logger";

// GET - List all clients (admin only)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const clients = await db.collection("users")
            .find({ role: 'client' }, { projection: { password: 0 } })
            .sort({ createdAt: -1 })
            .toArray();

        const clientsWithIds = clients.map(client => ({
            ...client,
            _id: client._id.toString(),
        }));

        return NextResponse.json({ clients: clientsWithIds });

    } catch (error) {
        console.error('Get clients error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create a new client (admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, password, company, industry, phone, website, role = 'client', onboardingCompleted = false } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role,
            company: company || '',
            industry: industry || '',
            phone: phone || '',
            website: website || '',
            onboardingCompleted,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("users").insertOne(newUser);

        await logAction({
            action: 'Client Created',
            userId: session.user.id,
            userName: session.user.name,
            targetId: result.insertedId,
            targetName: newUser.name,
            details: `Admin created a new client: ${newUser.name} (${newUser.company})`,
            type: 'success'
        });

        return NextResponse.json({
            success: true,
            client: {
                _id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                company: newUser.company,
                industry: newUser.industry,
                phone: newUser.phone,
                website: newUser.website,
                onboardingCompleted: newUser.onboardingCompleted,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create client error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
