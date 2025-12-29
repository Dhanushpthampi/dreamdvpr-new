/**
 * Reusable component for editing arrays of items (points, FAQ items, etc.)
 * @module admin/content/components/ArrayItemEditor
 */

import { Box, VStack, HStack, IconButton, Text } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import ThemedInput from '@/app/components/ThemedInput';

/**
 * ArrayItemEditor - Manages a list of items with add/remove functionality
 */
export function ArrayItemEditor({
  title,
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  renderItem = (item, index, onChange) => (
    <ThemedInput
      value={item}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter item"
    />
  ),
}) {
  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="semibold">{title}</Text>
        <IconButton
          icon={
            <Icon viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </Icon>
          }
          onClick={onAdd}
          aria-label="Add item"
          size="sm"
        />
      </HStack>
      <VStack spacing={3} align="stretch">
        {items.map((item, index) => (
          <HStack key={index}>
            {renderItem(item, index, (value) => onUpdate(index, value))}
            <IconButton
              icon={
                <Icon viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </Icon>
              }
              onClick={() => onRemove(index)}
              aria-label="Remove item"
              size="sm"
            />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
