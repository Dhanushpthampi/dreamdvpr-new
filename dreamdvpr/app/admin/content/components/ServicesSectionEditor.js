/**
 * Services section editor component
 * @module admin/content/components/ServicesSectionEditor
 */

import {
  VStack,
  Divider,
  Box,
  HStack,
  Text,
  IconButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
} from '@chakra-ui/react';

import { Icon } from '@chakra-ui/icons';
import { SectionEditor } from './SectionEditor';
import ThemedInput from '@/app/components/ThemedInput';

export function ServicesSectionEditor({ section, onChange }) {
  const handleAddService = () => {
    onChange({
      ...section,
      items: [
        ...(section.items || []),
        {
          title: '',
          description: '',
          media: '',
          colSpan: 1,
          rowSpan: 1,
        },
      ],
    });
  };

  const handleRemoveService = (index) => {
    const newItems = section.items.filter((_, i) => i !== index);
    onChange({ ...section, items: newItems });
  };

  const handleUpdateService = (index, field, value) => {
    const newItems = [...(section.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...section, items: newItems });
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
          <Text fontWeight="semibold">Service Items</Text>
          <IconButton
            size="sm"
            aria-label="Add service"
            onClick={handleAddService}
            icon={
              <Icon viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                />
              </Icon>
            }
          />
        </HStack>

        <VStack spacing={4} align="stretch">
          {(section.items || []).map((item, index) => (
            <Box
              key={index}
              p={4}
              border="1px"
              borderColor="gray.200"
              rounded="lg"
            >
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="semibold">
                    Service #{index + 1}
                  </Text>
                  <IconButton
                    size="sm"
                    aria-label="Remove service"
                    onClick={() => handleRemoveService(index)}
                    icon={
                      <Icon viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                      </Icon>
                    }
                  />
                </HStack>

                <ThemedInput
                  label="Title"
                  value={item.title}
                  onChange={(e) =>
                    handleUpdateService(index, 'title', e.target.value)
                  }
                />

                <ThemedInput
                  label="Description"
                  type="textarea"
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    handleUpdateService(index, 'description', e.target.value)
                  }
                />

                <ThemedInput
                  label="Video / GIF URL"
                  value={item.media}
                  placeholder="https://cdn.example.com/service.mp4"
                  onChange={(e) =>
                    handleUpdateService(index, 'media', e.target.value)
                  }
                  helperText="Supports .mp4, .webm, .gif"
                />

                <HStack>
                  <FormControl>
                    <FormLabel>Column Span</FormLabel>
                    <NumberInput
                      min={1}
                      max={3}
                      value={item.colSpan || 1}
                      onChange={(v) =>
                        handleUpdateService(
                          index,
                          'colSpan',
                          parseInt(v) || 1
                        )
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Row Span</FormLabel>
                    <NumberInput
                      min={1}
                      max={3}
                      value={item.rowSpan || 1}
                      onChange={(v) =>
                        handleUpdateService(
                          index,
                          'rowSpan',
                          parseInt(v) || 1
                        )
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
