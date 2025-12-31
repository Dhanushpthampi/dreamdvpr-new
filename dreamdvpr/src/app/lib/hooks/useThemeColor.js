'use client';

import { useState, useEffect } from 'react';

function getCSSVariable(variableName, defaultValue) {
    if (typeof window === 'undefined') return defaultValue;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    return value || defaultValue;
}

export function useThemeColor(colorVariable, defaultValue) {
    const [color, setColor] = useState(() => getCSSVariable(colorVariable, defaultValue));

    useEffect(() => {
        const updateColor = () => setColor(getCSSVariable(colorVariable, defaultValue));
        updateColor();
        window.addEventListener('theme-updated', updateColor);
        return () => window.removeEventListener('theme-updated', updateColor);
    }, [colorVariable, defaultValue]);

    return color;
}
