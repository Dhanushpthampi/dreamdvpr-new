'use client';

/**
 * Hook for fetching content from API
 * @module lib/hooks/useContent
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_CONTENT } from '../content/constants';
import { normalizeContent } from '../content/normalize';

/**
 * Hook to fetch and manage content for a specific section
 * @param {string} sectionKey - Content section key (e.g., 'hero', 'services', 'faq')
 * @returns {Object} Content data and loading state
 */
export function useContent(sectionKey) {
  // Memoize default content to prevent unnecessary re-renders
  const defaultSectionContent = useMemo(() => {
    return DEFAULT_CONTENT[sectionKey] || {};
  }, [sectionKey]);
  
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
        const sectionContent = normalizedContent[sectionKey];
        
        if (sectionContent) {
          setContent(sectionContent);
        } else {
          // Fallback to default content
          setContent(defaultSectionContent);
        }
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

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}
