'use client';

/**
 * React hook for content management in admin panel
 * @module lib/content/hooks/useContentManagement
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { normalizeContent } from '../normalize';
import { DEFAULT_CONTENT } from '../constants';

/**
 * Custom hook for managing content in admin panel
 * @returns {Object} Content state and management functions
 */
export function useContentManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  /**
   * Fetches content from API
   */
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      const data = await res.json();
      if (data.content) {
        const normalizedContent = normalizeContent(data.content);
        setContent(normalizedContent);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Saves content to API
   */
  const saveContent = useCallback(async (contentToSave) => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentToSave),
      });

      if (!res.ok) {
        throw new Error('Failed to save content');
      }

      // Trigger theme update if theme changed
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

  // Check authentication and fetch content
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
