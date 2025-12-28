'use client';

import { FormControl, FormLabel, Input, Textarea, FormErrorMessage, InputGroup, InputLeftElement } from '@chakra-ui/react';

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
    ...rest
}) => {
    const isTextarea = type === 'textarea';
    const InputComponent = isTextarea ? Textarea : Input;

    const inputStyles = {
        bg: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid',
        borderColor: error ? 'red.400' : 'rgba(255, 255, 255, 0.8)',
        color: 'gray.800',
        _placeholder: { color: 'gray.500' },
        _hover: { borderColor: error ? 'red.500' : 'brand.400' },
        _focus: {
            borderColor: error ? 'red.500' : 'brand.500',
            boxShadow: error
                ? '0 0 0 1px var(--chakra-colors-red-500)'
                : '0 0 0 1px var(--chakra-colors-brand-500)',
            bg: 'white',
        },
        fontWeight: 'medium',
    };

    const content = icon ? (
        <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray.500">
                {icon}
            </InputLeftElement>
            <InputComponent
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...inputStyles}
                {...rest}
            />
        </InputGroup>
    ) : (
        <InputComponent
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...inputStyles}
            {...rest}
        />
    );

    return (
        <FormControl isInvalid={!!error} isRequired={required}>
            {label && (
                <FormLabel fontWeight="semibold" color="gray.700" mb={2}>
                    {label}
                </FormLabel>
            )}
            {content}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default ThemedInput;
