'use client';

/**
 * Themed select dropdown component
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Array of {value, label} objects
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field
 */
const ThemedSelect = ({
    label,
    placeholder = 'Select an option',
    value,
    onChange,
    options = [],
    error,
    required = false,
    className = '',
    ...rest
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block font-semibold mb-2" style={{ color: '#374151' }}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 bg-white/60 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 hover:border-[#00abad]/50 focus:border-[#00abad] focus:ring-[#00abad]'
                    } ${className}`}
                required={required}
                {...rest}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default ThemedSelect;
