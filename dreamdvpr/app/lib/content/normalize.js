/**
 * Content normalization utilities
 * @module lib/content/normalize
 */

import { DEFAULT_CONTENT } from './constants';

/**
 * Normalizes content data to ensure all required sections are present
 * @param {Object} contentData - Raw content data from API
 * @returns {Object} Normalized content object with all required sections
 */
export function normalizeContent(contentData) {
  if (!contentData || typeof contentData !== 'object') {
    return DEFAULT_CONTENT;
  }

  return {
    hero: {
      title: contentData.hero?.title || DEFAULT_CONTENT.hero.title,
      titleHighlight: contentData.hero?.titleHighlight || DEFAULT_CONTENT.hero.titleHighlight,
      subtitle: contentData.hero?.subtitle || DEFAULT_CONTENT.hero.subtitle,
      ctaText: contentData.hero?.ctaText || DEFAULT_CONTENT.hero.ctaText,
    },
    services: {
      title: contentData.services?.title || DEFAULT_CONTENT.services.title,
      subtitle: contentData.services?.subtitle || DEFAULT_CONTENT.services.subtitle,
      items: contentData.services?.items || DEFAULT_CONTENT.services.items,
    },
    whyChooseUs: {
      title: contentData.whyChooseUs?.title || DEFAULT_CONTENT.whyChooseUs.title,
      titleHighlight: contentData.whyChooseUs?.titleHighlight || DEFAULT_CONTENT.whyChooseUs.titleHighlight,
      subtitle: contentData.whyChooseUs?.subtitle || DEFAULT_CONTENT.whyChooseUs.subtitle,
      points: contentData.whyChooseUs?.points || DEFAULT_CONTENT.whyChooseUs.points,
    },
    comparison: {
      title: contentData.comparison?.title || DEFAULT_CONTENT.comparison.title,
      subtitle: contentData.comparison?.subtitle || DEFAULT_CONTENT.comparison.subtitle,
      traditionalPoints: contentData.comparison?.traditionalPoints || DEFAULT_CONTENT.comparison.traditionalPoints,
      ourPoints: contentData.comparison?.ourPoints || DEFAULT_CONTENT.comparison.ourPoints,
    },
    faq: {
      title: contentData.faq?.title || DEFAULT_CONTENT.faq.title,
      subtitle: contentData.faq?.subtitle || DEFAULT_CONTENT.faq.subtitle,
      items: contentData.faq?.items || DEFAULT_CONTENT.faq.items,
    },
    cta: {
      title: contentData.cta?.title || DEFAULT_CONTENT.cta.title,
      subtitle: contentData.cta?.subtitle || DEFAULT_CONTENT.cta.subtitle,
      buttonText: contentData.cta?.buttonText || DEFAULT_CONTENT.cta.buttonText,
      points: contentData.cta?.points || DEFAULT_CONTENT.cta.points,
    },
    theme: contentData.theme || DEFAULT_CONTENT.theme,
  };
}
