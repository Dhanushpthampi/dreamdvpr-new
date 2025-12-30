'use client';

import { useState, useEffect, useCallback } from 'react';

export function useBlogs({ published = true, limit = null } = {}) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const queryParams = new URLSearchParams();
            if (published) queryParams.append('published', 'true');
            const res = await fetch(`/api/blogs?${queryParams.toString()}`);
            const data = await res.json();
            let fetchedBlogs = data.blogs || [];
            if (limit && limit > 0) fetchedBlogs = fetchedBlogs.slice(0, limit);
            setBlogs(fetchedBlogs);
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError(err);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [published, limit]);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

    return { blogs, loading, error, refetch: fetchBlogs };
}
