/**
 * Comparison section editor component
 * @module admin/content/components/ComparisonSectionEditor
 */

import { VStack, Divider } from '@chakra-ui/react';
import { SectionEditor } from './SectionEditor';
import { ArrayItemEditor } from './ArrayItemEditor';
import ThemedInput from '@/app/components/ThemedInput';

export function ComparisonSectionEditor({ section, onChange }) {
  const handleAddTraditionalPoint = () => {
    onChange({
      ...section,
      traditionalPoints: [...(section.traditionalPoints || []), ''],
    });
  };

  const handleRemoveTraditionalPoint = (index) => {
    const newPoints = section.traditionalPoints.filter((_, i) => i !== index);
    onChange({
      ...section,
      traditionalPoints: newPoints,
    });
  };

  const handleUpdateTraditionalPoint = (index, value) => {
    const newPoints = [...(section.traditionalPoints || [])];
    newPoints[index] = value;
    onChange({
      ...section,
      traditionalPoints: newPoints,
    });
  };

  const handleAddOurPoint = () => {
    onChange({
      ...section,
      ourPoints: [...(section.ourPoints || []), ''],
    });
  };

  const handleRemoveOurPoint = (index) => {
    const newPoints = section.ourPoints.filter((_, i) => i !== index);
    onChange({
      ...section,
      ourPoints: newPoints,
    });
  };

  const handleUpdateOurPoint = (index, value) => {
    const newPoints = [...(section.ourPoints || [])];
    newPoints[index] = value;
    onChange({
      ...section,
      ourPoints: newPoints,
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      <SectionEditor
        section={section}
        onChange={onChange}
        fields={['title', 'subtitle']}
      />
      <Divider />
      <ArrayItemEditor
        title="Traditional Agencies Points"
        items={section.traditionalPoints || []}
        onAdd={handleAddTraditionalPoint}
        onRemove={handleRemoveTraditionalPoint}
        onUpdate={handleUpdateTraditionalPoint}
        renderItem={(item, index, onChange) => (
          <ThemedInput
            value={item}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter point"
          />
        )}
      />
      <Divider />
      <ArrayItemEditor
        title="Our Points"
        items={section.ourPoints || []}
        onAdd={handleAddOurPoint}
        onRemove={handleRemoveOurPoint}
        onUpdate={handleUpdateOurPoint}
        renderItem={(item, index, onChange) => (
          <ThemedInput
            value={item}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter point"
          />
        )}
      />
    </VStack>
  );
}
