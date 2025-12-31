/**
 * Reusable ColorPicker component for theme colors
 * @module admin/content/components/ColorPicker
 */

/**
 * ColorPicker - Input with color picker and text field
 */
export function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
        {label}
      </label>
      <div className="flex gap-3 items-center">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-[#00abad] transition-colors"
          style={{ padding: '2px' }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad] transition-all"
        />
      </div>
    </div>
  );
}
