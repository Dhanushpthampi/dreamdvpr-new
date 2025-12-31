/**
 * Why Choose Us section editor component
 * @module admin/content/components/WhyChooseUsSectionEditor
 */

import { SectionEditor } from './SectionEditor';
import { ArrayItemEditor } from './ArrayItemEditor';
import ThemedInput from '@/app/components/ui/ThemedInput';

export function WhyChooseUsSectionEditor({ section, onChange }) {
  const handleAddPoint = () => {
    onChange({
      ...section,
      points: [...(section.points || []), ''],
    });
  };

  const handleRemovePoint = (index) => {
    const newPoints = section.points.filter((_, i) => i !== index);
    onChange({
      ...section,
      points: newPoints,
    });
  };

  const handleUpdatePoint = (index, value) => {
    const newPoints = [...(section.points || [])];
    newPoints[index] = value;
    onChange({
      ...section,
      points: newPoints,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionEditor
        section={section}
        onChange={onChange}
        fields={['title', 'titleHighlight', 'subtitle']}
      />
      <div className="border-t border-gray-200" />
      <ArrayItemEditor
        title="Points"
        items={section.points || []}
        onAdd={handleAddPoint}
        onRemove={handleRemovePoint}
        onUpdate={handleUpdatePoint}
        renderItem={(item, index, onChange) => (
          <ThemedInput
            value={item}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter point"
          />
        )}
      />
    </div>
  );
}
