/**
 * Services section editor component
 * @module admin/content/components/ServicesSectionEditor
 */

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
    <div className="flex flex-col gap-6">
      <SectionEditor
        section={section}
        onChange={onChange}
        fields={['title', 'subtitle']}
      />

      <div className="border-t border-gray-200" />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold" style={{ color: '#1d1d1f' }}>
            Service Items
          </h3>
          <button
            onClick={handleAddService}
            aria-label="Add service"
            className="p-2 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {(section.items || []).map((item, index) => (
            <div
              key={index}
              className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-[#00abad]/50 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-base" style={{ color: '#1d1d1f' }}>
                    Service #{index + 1}
                  </h4>
                  <button
                    onClick={() => handleRemoveService(index)}
                    aria-label="Remove service"
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
                      Column Span
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newValue = Math.max(1, (item.colSpan || 1) - 1);
                          handleUpdateService(index, 'colSpan', newValue);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={3}
                        value={item.colSpan || 1}
                        onChange={(e) =>
                          handleUpdateService(
                            index,
                            'colSpan',
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad] text-center"
                      />
                      <button
                        onClick={() => {
                          const newValue = Math.min(3, (item.colSpan || 1) + 1);
                          handleUpdateService(index, 'colSpan', newValue);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold" style={{ color: '#1d1d1f' }}>
                      Row Span
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newValue = Math.max(1, (item.rowSpan || 1) - 1);
                          handleUpdateService(index, 'rowSpan', newValue);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={3}
                        value={item.rowSpan || 1}
                        onChange={(e) =>
                          handleUpdateService(
                            index,
                            'rowSpan',
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00abad] focus:border-[#00abad] text-center"
                      />
                      <button
                        onClick={() => {
                          const newValue = Math.min(3, (item.rowSpan || 1) + 1);
                          handleUpdateService(index, 'rowSpan', newValue);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(section.items || []).length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm" style={{ color: '#86868b' }}>
              No services yet. Click the + button to add one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
