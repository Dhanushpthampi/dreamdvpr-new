/**
 * FAQ section editor component
 * @module admin/content/components/FAQSectionEditor
 */

import { VStack, Divider, Box, HStack, Text, IconButton } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { SectionEditor } from './SectionEditor';
import ThemedInput from '@/app/components/ThemedInput';

export function FAQSectionEditor({ section, onChange }) {
  const handleAddFAQ = () => {
    onChange({
      ...section,
      items: [...(section.items || []), { question: '', answer: '' }],
    });
  };

  const handleRemoveFAQ = (index) => {
    const newItems = section.items.filter((_, i) => i !== index);
    onChange({
      ...section,
      items: newItems,
    });
  };

  const handleUpdateFAQ = (index, field, value) => {
    const newItems = [...(section.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({
      ...section,
      items: newItems,
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
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="semibold">FAQ Items</Text>
          <IconButton
            icon={
              <Icon viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </Icon>
            }
            onClick={handleAddFAQ}
            aria-label="Add FAQ"
            size="sm"
          />
        </HStack>
        <VStack spacing={4} align="stretch">
          {(section.items || []).map((item, index) => (
            <Box key={index} p={4} border="1px" borderColor="gray.200" rounded="lg">
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="semibold">FAQ #{index + 1}</Text>
                  <IconButton
                    icon={
                      <Icon viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </Icon>
                    }
                    onClick={() => handleRemoveFAQ(index)}
                    aria-label="Remove FAQ"
                    size="sm"
                  />
                </HStack>
                <ThemedInput
                  label="Question"
                  value={item.question}
                  onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                />
                <ThemedInput
                  label="Answer"
                  type="textarea"
                  value={item.answer}
                  onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                  rows={3}
                />
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
