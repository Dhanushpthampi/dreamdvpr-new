/**
 * Hero section editor component
 * @module admin/content/components/HeroSectionEditor
 */

import { SectionEditor } from './SectionEditor';

export function HeroSectionEditor({ section, onChange }) {
  return (
    <SectionEditor
      section={section}
      onChange={onChange}
      fields={['title', 'titleHighlight', 'subtitle', 'ctaText']}
    />
  );
}
