/**
 * FAQ section editor component
 * @module admin/content/components/FAQSectionEditor
 */

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
            FAQ Items
          </h3>
          <button
            onClick={handleAddFAQ}
            aria-label="Add FAQ"
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
                    FAQ #{index + 1}
                  </h4>
                  <button
                    onClick={() => handleRemoveFAQ(index)}
                    aria-label="Remove FAQ"
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
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
              </div>
            </div>
          ))}
        </div>
        {(section.items || []).length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm" style={{ color: '#86868b' }}>
              No FAQ items yet. Click the + button to add one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
