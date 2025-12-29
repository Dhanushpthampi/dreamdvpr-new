/**
 * Reusable ColorPicker component for theme colors
 * @module admin/content/components/ColorPicker
 */

import { FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';

/**
 * ColorPicker - Input with color picker and text field
 */
export function ColorPicker({ label, value, onChange }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <HStack>
        <Input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          w="60px"
          h="40px"
          p={1}
        />
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </HStack>
    </FormControl>
  );
}
