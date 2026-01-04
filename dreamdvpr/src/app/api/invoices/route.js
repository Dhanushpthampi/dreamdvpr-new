import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - List invoices
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        let query = {};

        // Clients can only see their own invoices
        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            query.clientId = user._id;
        }

        const invoices = await db.collection("invoices")
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        // Populate client/project info
        const populatedInvoices = await Promise.all(invoices.map(async (invoice) => {
            const clientInfo = await db.collection("users").findOne({ _id: invoice.clientId }, { projection: { password: 0 } });
            const projectInfo = invoice.projectId ? await db.collection("projects").findOne({ _id: invoice.projectId }) : null;

            return {
                ...invoice,
                _id: invoice._id.toString(),
                clientId: invoice.clientId.toString(),
                projectId: invoice.projectId?.toString(),
                client: clientInfo,
                project: projectInfo
            };
        }));

        return NextResponse.json({ invoices: populatedInvoices });

    } catch (error) {
        console.error('Get invoices error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create invoice (Admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { clientId, projectId, amount, description, dueDate, invoiceNumber } = data;

        if (!clientId || !amount || !invoiceNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const invoice = {
            clientId: new ObjectId(clientId),
            projectId: projectId ? new ObjectId(projectId) : null,
            amount: parseFloat(amount),
            description: description || '',
            dueDate: new Date(dueDate),
            invoiceNumber,
            status: 'pending', // pending, paid, cancelled
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("invoices").insertOne(invoice);

        return NextResponse.json({
            success: true,
            invoiceId: result.insertedId.toString(),
            message: 'Invoice created successfully'
        });

    } catch (error) {
        console.error('Create invoice error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
