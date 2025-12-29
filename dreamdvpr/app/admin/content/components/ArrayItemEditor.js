/**
 * Reusable component for editing arrays of items (points, FAQ items, etc.)
 * @module admin/content/components/ArrayItemEditor
 */

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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold" style={{ color: '#1d1d1f' }}>
          {title}
        </h3>
        <button
          onClick={onAdd}
          aria-label="Add item"
          className="p-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1">
              {renderItem(item, index, (value) => onUpdate(index, value))}
            </div>
            <button
              onClick={() => onRemove(index)}
              aria-label="Remove item"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm" style={{ color: '#86868b' }}>
              No items yet. Click the + button to add one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
