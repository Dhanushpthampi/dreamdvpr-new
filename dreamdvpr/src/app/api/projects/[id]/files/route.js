import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { logAction } from "@/app/lib/logger";
import { createFolder, uploadFile, listFiles } from "@/app/lib/googleDrive";

// GET - List files
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

        // Authorization check
        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (project.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        let folderId = project.googleDriveFolderId;

        // Create folder if it doesn't exist
        if (!folderId) {
            // Check if we already have a root folder for "REDgravity Projects" or similar (optional optimization)
            // For now, creating top-level folders or we could organize better later.
            // Let's create a folder named "Project: [ProjectName]"

            try {
                const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
                try {
                    folderId = await createFolder(`Project: ${project.name} (${project._id})`, rootFolderId);
                } catch (rootError) {
                    console.warn("Could not create in configured root folder. Falling back to 'My Drive' root.");
                    folderId = await createFolder(`Project: ${project.name} (${project._id})`);
                }

                await db.collection("projects").updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { googleDriveFolderId: folderId } }
                );
            } catch (err) {
                console.error("Failed to create Drive folder:", err);
                return NextResponse.json({ error: 'Failed to initialize project storage' }, { status: 500 });
            }
        }

        const files = await listFiles(folderId);
        return NextResponse.json({ files });

    } catch (error) {
        console.error('Get files error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Upload file
export async function POST(request, { params }) {
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

        // Authorization check
        if (session.user.role === 'client') {
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (project.clientId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        let folderId = project.googleDriveFolderId;
        if (!folderId) {
            // Should have been created by GET usually, but let's handle it
            const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
            folderId = await createFolder(`Project: ${project.name} (${project._id})`, rootFolderId);
            await db.collection("projects").updateOne(
                { _id: new ObjectId(id) },
                { $set: { googleDriveFolderId: folderId } }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        let uploadedFile;
        try {
            uploadedFile = await uploadFile(buffer, file.name, file.type, folderId);
        } catch (error) {
            // Check for 404 (File not found) or 403 (storage quota) - retry with new folder for 404
            console.warn("Upload failed, checking if folder is stale...", error.message);

            if (error.code === 404 || (error.message && error.message.includes('File not found'))) {
                console.log("Stale Folder ID detected. Creating new folder and retrying...");

                const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
                try {
                    folderId = await createFolder(`Project: ${project.name} (${project._id})`, rootFolderId);
                } catch (rootError) {
                    console.warn("Could not create in configured root folder. Falling back to 'My Drive' root.");
                    folderId = await createFolder(`Project: ${project.name} (${project._id})`);
                }

                // Update DB with new folder ID
                await db.collection("projects").updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { googleDriveFolderId: folderId } }
                );

                // Retry upload with new folder
                uploadedFile = await uploadFile(buffer, file.name, file.type, folderId);
            } else {
                // If it's not a 404, rethrow
                throw error;
            }
        }

        await logAction({
            action: 'File Uploaded',
            userId: session.user.id,
            userName: session.user.name,
            targetId: uploadedFile.id,
            targetName: file.name,
            details: `Uploaded file "${file.name}" to project folder`,
            type: 'success'
        });

        return NextResponse.json({ success: true, file: uploadedFile });

    } catch (error) {
        console.error('Upload file error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
