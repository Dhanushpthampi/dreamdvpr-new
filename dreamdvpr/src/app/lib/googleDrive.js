// lib/googleDrive.js
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function createFolder(folderName, parentId = null) {
    try {
        const fileMetadata = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
        };
        if (parentId) {
            fileMetadata.parents = [parentId];
        }
        const file = await drive.files.create({
            resource: fileMetadata,
            fields: "id",
        });
        return file.data.id;
    } catch (error) {
        console.error("Error creating folder:", error);
        throw error;
    }
}

export async function uploadFile(fileBuffer, fileName, mimeType, folderId) {
    try {
        const { Readable } = require("stream");
        const stream = new Readable();
        stream.push(fileBuffer);
        stream.push(null);

        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };
        const media = {
            mimeType: mimeType,
            body: stream,
        };
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id, name, webViewLink, webContentLink",
        });
        return file.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

export async function listFiles(folderId) {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: "files(id, name, mimeType, webViewLink, webContentLink, createdTime, size, iconLink)",
            orderBy: "createdTime desc",
        });
        return res.data.files;
    } catch (error) {
        console.error("Error listing files:", error);
        return [];
    }
}

export async function deleteFile(fileId) {
    try {
        await drive.files.delete({
            fileId: fileId,
        });
        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
}

export async function getFile(fileId) {
    try {
        const response = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
        );
        return response.data;
    } catch (error) {
        console.error("Error getting file:", error);
        throw error;
    }
}
