'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DEFAULT_CONTENT, normalizeContent } from '../content';

export function useContentManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState(DEFAULT_CONTENT);

    const fetchContent = useCallback(async () => {
        try {
            const res = await fetch('/api/content', { cache: 'no-store' });
            const data = await res.json();
            if (data.content) setContent(normalizeContent(data.content));
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveContent = useCallback(async (contentToSave) => {
        setSaving(true);
        try {
            const res = await fetch('/api/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contentToSave),
            });
            if (!res.ok) throw new Error('Failed to save content');
            if (contentToSave.theme) {
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('theme-updated', JSON.stringify(contentToSave.theme));
                }
                window.dispatchEvent(new CustomEvent('theme-updated', { detail: contentToSave.theme }));
            }
            return { success: true };
        } catch (error) {
            console.error('Error saving content:', error);
            return { success: false, error: error.message };
        } finally {
            setSaving(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchContent();
            }
        }
    }, [status, session, router, fetchContent]);

    return {
        content,
        setContent,
        loading,
        saving,
        fetchContent,
        saveContent,
        isAuthenticated: status === 'authenticated' && session?.user?.role === 'admin',
    };
}
