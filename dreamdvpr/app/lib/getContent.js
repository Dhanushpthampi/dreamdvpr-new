import clientPromise from "./db";
import { DEFAULT_CONTENT } from "./content/constants";
import { normalizeContent } from "./content/normalize";

/**
 * Server-side function to get content (used in layouts/pages)
 * @returns {Promise<Object>} Normalized content object
 */
export async function getContent() {
    try {
        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const content = await db.collection("homepage_content").findOne({ type: 'homepage' });

        if (!content) {
            return DEFAULT_CONTENT;
        }

        // Normalize content to ensure all fields are present
        return normalizeContent(content.data);
    } catch (error) {
        console.error('Error fetching content:', error);
        return DEFAULT_CONTENT;
    }
}
