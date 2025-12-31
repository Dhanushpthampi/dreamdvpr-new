'use client';

import { useThemeColor } from './useThemeColor';

export function useBackgroundColor(variant = 'primary') {
    const colorVariable = variant === 'primary' ? '--color-bg-app' : '--color-bg-secondary';
    const defaultValue = variant === 'primary' ? '#f5f5f7' : '#ffffff';
    return useThemeColor(colorVariable, defaultValue);
}
