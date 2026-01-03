'use client';

/**
 * Themed input component with consistent styling
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type: 'text' | 'email' | 'tel' | 'password' | 'number' | 'textarea'
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field
 * @param {React.ReactNode} props.icon - Left icon element
 * @param {string} props.helperText - Helper text to display below input
 */
const ThemedInput = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
    icon,
    helperText,
    className = '',
    ...rest
}) => {
    const isTextarea = type === 'textarea';
    const InputComponent = isTextarea ? 'textarea' : 'input';

    // Remove helperText from rest props to prevent passing to DOM
    const { helperText: _, ...domProps } = rest;

    const baseClasses = `w-full px-4 py-3 bg-white/60 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 hover:border-[#00abad]/50 focus:border-[#00abad] focus:ring-[#00abad]'
        } ${className}`;

    const content = icon ? (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                {icon}
            </div>
            {isTextarea ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${baseClasses} pl-10`}
                    required={required}
                    {...domProps}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${baseClasses} pl-10`}
                    required={required}
                    {...domProps}
                />
            )}
        </div>
    ) : (
        isTextarea ? (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={baseClasses}
                required={required}
                {...domProps}
            />
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={baseClasses}
                required={required}
                {...domProps}
            />
        )
    );

    return (
        <div className="w-full">
            {label && (
                <label className="block font-semibold mb-2" style={{ color: '#374151' }}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {content}
            {helperText && !error && (
                <p className="mt-1 text-xs" style={{ color: '#86868b' }}>{helperText}</p>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default ThemedInput;
