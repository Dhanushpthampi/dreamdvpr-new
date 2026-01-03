import clientPromise from "./db";

export async function logAction({ action, userId, userName, targetId, targetName, details, type = 'info' }) {
    try {
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const logEntry = {
            action,
            userId,
            userName,
            targetId: targetId ? targetId.toString() : null,
            targetName,
            details,
            type, // info, success, warning, error
            timestamp: new Date(),
        };

        await db.collection("activity_logs").insertOne(logEntry);
        return true;
    } catch (error) {
        console.error("Failed to log action:", error);
        return false;
    }
}
