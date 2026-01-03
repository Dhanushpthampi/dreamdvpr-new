import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { deleteFile, getFile } from "@/app/lib/googleDrive";
import { Readable } from 'stream';

// DELETE - Delete file
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, fileId } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Project ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");
        const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Authorization check
        // Only Admin can delete files? Or client too? 
        // User request says "client they can add fles and view and all that"
        // Let's assume both can delete for now, or maybe restrict client deletion to their own files?
        // For simplicity as requested "files tab... add files... etc", allowing delete for authorized users.

        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (project.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        await deleteFile(fileId);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete file error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - Download file
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, fileId } = await params;

        // Basic auth check again
        const client = await clientPromise;
        const db = client.db("dreamdvpr");
        const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (project.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        const fileStream = await getFile(fileId);

        // Convert the stream to a Web ReadableStream
        const webStream = new ReadableStream({
            start(controller) {
                fileStream.on('data', (chunk) => controller.enqueue(chunk));
                fileStream.on('end', () => controller.close());
                fileStream.on('error', (err) => controller.error(err));
            }
        });

        return new NextResponse(webStream, {
            headers: {
                'Content-Type': 'application/octet-stream',
                // We might want to get the actual mimetype and filename if possible, 
                // but getFile helper currently just returns the stream.
                // We could enhance getFile to return metadata too if needed.
                // For now this will trigger download.
            },
        });

    } catch (error) {
        console.error('Download file error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
