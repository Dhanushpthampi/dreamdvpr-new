/**
 * Theme section editor component
 * @module admin/content/components/ThemeSectionEditor
 */

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
    <div className="flex flex-col gap-8">
      {/* Colors Section */}
      <div>
        <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1f' }}>
          Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Fonts Section */}
      <div>
        <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1f' }}>
          Fonts
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
              Heading Font
            </label>
            <input
              type="text"
              value={section?.fonts?.heading || ''}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              placeholder="e.g., -apple-system, BlinkMacSystemFont, 'Segoe UI'"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad] transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
              Body Font
            </label>
            <input
              type="text"
              value={section?.fonts?.body || ''}
              onChange={(e) => handleFontChange('body', e.target.value)}
              placeholder="e.g., -apple-system, BlinkMacSystemFont, 'Segoe UI'"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Other Settings Section */}
      <div>
        <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1f' }}>
          Other Settings
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
              Border Radius
            </label>
            <select
              value={section?.borderRadius || 'xl'}
              onChange={(e) => handleOtherChange('borderRadius', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad] transition-all bg-white"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
              <option value="2xl">2X Large</option>
              <option value="full">Full (Circle)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
              Logo URL
            </label>
            <input
              type="url"
              value={section?.logo || ''}
              onChange={(e) => handleOtherChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad] transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
