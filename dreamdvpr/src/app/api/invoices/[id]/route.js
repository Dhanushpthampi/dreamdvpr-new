import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Get single invoice
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(id) });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Security check
        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (invoice.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        return NextResponse.json({
            invoice: {
                ...invoice,
                _id: invoice._id.toString(),
                clientId: invoice.clientId.toString(),
                projectId: invoice.projectId?.toString(),
            }
        });

    } catch (error) {
        console.error('Get invoice error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update invoice (Admin only for status, etc.)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();
        const { status, amount, description, dueDate } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const updateData = {
            updatedAt: new Date(),
        };

        if (status) updateData.status = status;
        if (amount) updateData.amount = parseFloat(amount);
        if (description) updateData.description = description;
        if (dueDate) updateData.dueDate = new Date(dueDate);

        const result = await db.collection("invoices").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Invoice updated successfully'
        });

    } catch (error) {
        console.error('Update invoice error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove invoice (Admin only)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const result = await db.collection("invoices").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Invoice deleted successfully'
        });

    } catch (error) {
        console.error('Delete invoice error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
