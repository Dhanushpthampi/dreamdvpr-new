'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_CONTENT, normalizeContent } from '../content';

export function useContent(sectionKey) {
    const defaultSectionContent = useMemo(() => DEFAULT_CONTENT[sectionKey] || {}, [sectionKey]);
    const [content, setContent] = useState(defaultSectionContent);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/content', { cache: 'no-store' });
            const data = await res.json();
            if (data.content) {
                const normalizedContent = normalizeContent(data.content);
                setContent(normalizedContent[sectionKey] || defaultSectionContent);
            } else {
                setContent(defaultSectionContent);
            }
        } catch (err) {
            console.error(`Error fetching ${sectionKey} content:`, err);
            setError(err);
            setContent(defaultSectionContent);
        } finally {
            setLoading(false);
        }
    }, [sectionKey, defaultSectionContent]);

    useEffect(() => { fetchContent(); }, [fetchContent]);

    return { content, loading, error, refetch: fetchContent };
}
