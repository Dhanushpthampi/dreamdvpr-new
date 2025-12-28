// Static content cache - updated when admin saves content
let contentCache = null;
let cacheTimestamp = null;

export async function getContent() {
    // If we have cached content and it's less than 5 minutes old, use it
    if (contentCache && cacheTimestamp && Date.now() - cacheTimestamp < 5 * 60 * 1000) {
        return contentCache;
    }

    try {
        // Only fetch if cache is stale or doesn't exist
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/content`, {
            cache: 'no-store',
        });
        const data = await res.json();
        if (data.content) {
            contentCache = data.content;
            cacheTimestamp = Date.now();
        }
        return contentCache || data.content;
    } catch (error) {
        console.error('Error fetching content:', error);
        return contentCache || null;
    }
}

export function setContentCache(content) {
    contentCache = content;
    cacheTimestamp = Date.now();
}

export function clearContentCache() {
    contentCache = null;
    cacheTimestamp = null;
}
