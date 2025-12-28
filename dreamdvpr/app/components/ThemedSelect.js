'use client';

import { FormControl, FormLabel, Select, FormErrorMessage } from '@chakra-ui/react';

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
    ...rest
}) => {
    return (
        <FormControl isInvalid={!!error} isRequired={required}>
            {label && (
                <FormLabel fontWeight="semibold" color="gray.700" mb={2}>
                    {label}
                </FormLabel>
            )}
            <Select
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                bg="rgba(255, 255, 255, 0.6)"
                border="1px solid"
                borderColor={error ? 'red.400' : 'rgba(255, 255, 255, 0.8)'}
                color="gray.800"
                fontWeight="medium"
                _hover={{ borderColor: error ? 'red.500' : 'brand.400' }}
                _focus={{
                    borderColor: error ? 'red.500' : 'brand.500',
                    boxShadow: error
                        ? '0 0 0 1px var(--chakra-colors-red-500)'
                        : '0 0 0 1px var(--chakra-colors-brand-500)',
                    bg: 'white',
                }}
                {...rest}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default ThemedSelect;
