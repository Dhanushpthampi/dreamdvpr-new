/**
 * Base section editor component with common fields
 * @module admin/content/components/SectionEditor
 */

import { VStack } from '@chakra-ui/react';
import ThemedInput from '@/app/components/ThemedInput';

/**
 * SectionEditor - Base component for editing section content
 */
export function SectionEditor({ section, onChange, fields = ['title', 'subtitle'] }) {
  const handleFieldChange = (field, value) => {
    onChange({
      ...section,
      [field]: value,
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      {fields.includes('title') && (
        <ThemedInput
          label="Title"
          value={section.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
        />
      )}
      {fields.includes('titleHighlight') && (
        <ThemedInput
          label="Title Highlight (text to highlight in brand color)"
          value={section.titleHighlight || ''}
          onChange={(e) => handleFieldChange('titleHighlight', e.target.value)}
        />
      )}
      {fields.includes('subtitle') && (
        <ThemedInput
          label="Subtitle"
          type="textarea"
          value={section.subtitle || ''}
          onChange={(e) => handleFieldChange('subtitle', e.target.value)}
          rows={3}
        />
      )}
      {fields.includes('ctaText') && (
        <ThemedInput
          label="CTA Button Text"
          value={section.ctaText || ''}
          onChange={(e) => handleFieldChange('ctaText', e.target.value)}
        />
      )}
      {fields.includes('buttonText') && (
        <ThemedInput
          label="Button Text"
          value={section.buttonText || ''}
          onChange={(e) => handleFieldChange('buttonText', e.target.value)}
        />
      )}
    </VStack>
  );
}
