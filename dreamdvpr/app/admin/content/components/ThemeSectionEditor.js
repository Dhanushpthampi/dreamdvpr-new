/**
 * Theme section editor component
 * @module admin/content/components/ThemeSectionEditor
 */

import { VStack, Box, Heading, Divider, SimpleGrid, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { ColorPicker } from './ColorPicker';

export function ThemeSectionEditor({ section, onChange }) {
  const handleColorChange = (colorKey, value) => {
    onChange({
      ...section,
      colors: {
        ...section.colors,
        [colorKey]: value,
      },
    });
  };

  const handleFontChange = (fontKey, value) => {
    onChange({
      ...section,
      fonts: {
        ...section.fonts,
        [fontKey]: value,
      },
    });
  };

  const handleOtherChange = (key, value) => {
    onChange({
      ...section,
      [key]: value,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={4}>Colors</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <ColorPicker
            label="Brand Primary"
            value={section?.colors?.brand500}
            onChange={(value) => handleColorChange('brand500', value)}
          />
          <ColorPicker
            label="Brand Secondary"
            value={section?.colors?.brand600}
            onChange={(value) => handleColorChange('brand600', value)}
          />
          <ColorPicker
            label="Text Main"
            value={section?.colors?.textMain}
            onChange={(value) => handleColorChange('textMain', value)}
          />
          <ColorPicker
            label="Text Secondary"
            value={section?.colors?.textSecondary}
            onChange={(value) => handleColorChange('textSecondary', value)}
          />
          <ColorPicker
            label="Background Primary"
            value={section?.colors?.bgApp}
            onChange={(value) => handleColorChange('bgApp', value)}
          />
          <ColorPicker
            label="Background Secondary"
            value={section?.colors?.bgSecondary}
            onChange={(value) => handleColorChange('bgSecondary', value)}
          />
          <ColorPicker
            label="Accent"
            value={section?.colors?.accent500}
            onChange={(value) => handleColorChange('accent500', value)}
          />
        </SimpleGrid>
      </Box>
      <Divider />
      <Box>
        <Heading size="md" mb={4}>Fonts</Heading>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Heading Font</FormLabel>
            <Input
              value={section?.fonts?.heading || ''}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              placeholder="e.g., -apple-system, BlinkMacSystemFont, 'Segoe UI'"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Body Font</FormLabel>
            <Input
              value={section?.fonts?.body || ''}
              onChange={(e) => handleFontChange('body', e.target.value)}
              placeholder="e.g., -apple-system, BlinkMacSystemFont, 'Segoe UI'"
            />
          </FormControl>
        </VStack>
      </Box>
      <Divider />
      <Box>
        <Heading size="md" mb={4}>Other Settings</Heading>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Border Radius</FormLabel>
            <Select
              value={section?.borderRadius || 'xl'}
              onChange={(e) => handleOtherChange('borderRadius', e.target.value)}
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
              <option value="2xl">2X Large</option>
              <option value="full">Full (Circle)</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Logo URL</FormLabel>
            <Input
              value={section?.logo || ''}
              onChange={(e) => handleOtherChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </FormControl>
        </VStack>
      </Box>
    </VStack>
  );
}
