'use client';

/**
 * Themed button component with consistent styling
 * @param {Object} props
 * @param {string} props.variant - Button variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isDisabled - Disabled state
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} props.children - Button content
 */
const ThemedButton = ({
    variant = 'primary',
    isLoading = false,
    isDisabled = false,
    size = 'md',
    children,
    className = '',
    leftIcon,
    ...rest
}) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
        primary: 'bg-[#e53e3e] text-white hover:bg-[#c53030] active:bg-[#9b2c2c]',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
        outline: 'bg-transparent text-[#e53e3e] border-2 border-[#e53e3e] hover:bg-[#e53e3e]/5 active:bg-[#e53e3e]/10',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    };

    return (
        <button
            className={`${sizeClasses[size]} ${variantClasses[variant]} font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
            disabled={isDisabled || isLoading}
            {...rest}
        >
            {isLoading ? (
                <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {leftIcon && <span>{leftIcon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default ThemedButton;