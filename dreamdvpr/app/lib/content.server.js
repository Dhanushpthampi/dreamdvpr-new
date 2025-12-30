import clientPromise from "./db";
import { DEFAULT_CONTENT, normalizeContent } from "./content";

export async function getContent() {
    try {
        const client = await clientPromise;
        const db = client.db("dreamdvpr");
        const content = await db.collection("homepage_content").findOne({ type: 'homepage' });
        if (!content) return DEFAULT_CONTENT;
        return normalizeContent(content.data);
    } catch (error) {
        console.error('Error fetching content:', error);
        return DEFAULT_CONTENT;
    }
}
