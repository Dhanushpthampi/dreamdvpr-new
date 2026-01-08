import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
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

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const clientData = await db.collection("users").findOne(
            { _id: new ObjectId(id), role: 'client' }
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

        const { id } = await params;
        const data = await request.json();
        const { name, email, company, industry, phone, website, address, password } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const updateData = {
            updatedAt: new Date(),
        };

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (company) updateData.company = company;
        if (industry) updateData.industry = industry;
        if (phone) updateData.phone = phone;
        if (website) updateData.website = website;
        if (address !== undefined) updateData.address = address;

        if (password) {
            const bcrypt = require('bcryptjs');
            updateData.password = await bcrypt.hash(password, 10);
        }

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

// DELETE - Remove client
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const result = await db.collection("users").deleteOne({
            _id: new ObjectId(id),
            role: 'client'
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Client deleted successfully'
        });

    } catch (error) {
        console.error('Delete client error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
