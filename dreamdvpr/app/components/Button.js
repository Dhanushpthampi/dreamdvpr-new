import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    href,
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden group";

    const variants = {
        primary: "bg-[#00abad] text-white shadow-[0_0_20px_rgba(0,171,173,0.4)] hover:shadow-[0_0_30px_rgba(0,171,173,0.6)] border border-transparent",
        secondary: "bg-white/10 backdrop-blur-md text-[#1d1d1f] border border-white/20 hover:bg-white/20 hover:border-white/40",
        outline: "bg-transparent border border-[#1d1d1f]/20 text-[#1d1d1f] hover:border-[#1d1d1f]/50",
        white: "bg-white text-[#1d1d1f] hover:bg-gray-50 shadow-lg",
    };

    const Component = href ? 'a' : 'button';

    return (
        <Component
            href={href}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
        </Component>
    );
};

export default Button;
