import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Get single client
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const clientData = await db.collection("users").findOne(
            { _id: new ObjectId(id), role: 'client' },
            { projection: { password: 0 } }
        );

        if (!clientData) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({
            client: {
                ...clientData,
                _id: clientData._id.toString(),
            }
        });

    } catch (error) {
        console.error('Get client error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update client information
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const data = await request.json();
        const { name, company, industry, phone, website } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const updateData = {
            updatedAt: new Date(),
        };

        if (name) updateData.name = name;
        if (company) updateData.company = company;
        if (industry) updateData.industry = industry;
        if (phone) updateData.phone = phone;
        if (website) updateData.website = website;

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id), role: 'client' },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Client updated successfully'
        });

    } catch (error) {
        console.error('Update client error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
