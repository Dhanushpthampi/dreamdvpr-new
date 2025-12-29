/**
 * CTA section editor component
 * @module admin/content/components/CTASectionEditor
 */

import { VStack, Divider } from '@chakra-ui/react';
import { SectionEditor } from './SectionEditor';
import { ArrayItemEditor } from './ArrayItemEditor';
import ThemedInput from '@/app/components/ThemedInput';

export function CTASectionEditor({ section, onChange }) {
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
    <VStack spacing={4} align="stretch">
      <SectionEditor
        section={section}
        onChange={onChange}
        fields={['title', 'subtitle', 'buttonText']}
      />
      <Divider />
      <ArrayItemEditor
        title="Points/Features"
        items={section.points || []}
        onAdd={handleAddPoint}
        onRemove={handleRemovePoint}
        onUpdate={handleUpdatePoint}
        renderItem={(item, index, onChange) => (
          <ThemedInput
            value={item}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter point/feature"
          />
        )}
      />
    </VStack>
  );
}
