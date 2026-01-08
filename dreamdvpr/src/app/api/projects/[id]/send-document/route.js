import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { logAction } from "@/app/lib/logger";
import { createFolder, uploadFile } from "@/app/lib/googleDrive";

export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Project ID' }, { status: 400 });
        }

        const body = await request.json();
        const { documentUrl, fileName } = body;

        if (!documentUrl || !fileName) {
            return NextResponse.json({ error: 'documentUrl and fileName are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");
        const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // 1. Download the document
        const response = await fetch(documentUrl);
        if (!response.ok) {
            throw new Error(`Failed to download document from ${documentUrl}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Ensure project folder exists in Drive
        let folderId = project.googleDriveFolderId;
        if (!folderId) {
            const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
            try {
                folderId = await createFolder(`Project: ${project.name} (${project._id})`, rootFolderId);
            } catch (error) {
                console.warn("Falling back to root Drive folder");
                folderId = await createFolder(`Project: ${project.name} (${project._id})`);
            }

            await db.collection("projects").updateOne(
                { _id: new ObjectId(id) },
                { $set: { googleDriveFolderId: folderId } }
            );
        }

        // 3. Upload to Google Drive
        const mimeType = 'application/pdf'; // Assuming PDF for now as per doc generator
        const uploadedFile = await uploadFile(buffer, fileName, mimeType, folderId);

        await logAction({
            action: 'Document Sent to Drive',
            userId: session.user.id,
            userName: session.user.name,
            targetId: uploadedFile.id,
            targetName: fileName,
            details: `Sent document "${fileName}" to project Drive folder`,
            type: 'success'
        });

        return NextResponse.json({
            success: true,
            message: 'Document sent to Drive successfully',
            file: uploadedFile
        });

    } catch (error) {
        console.error('Send document error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
