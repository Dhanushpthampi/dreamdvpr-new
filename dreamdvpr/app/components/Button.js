import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  href,
  ...props
}) => {
  const baseStyles =
    'px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden group';

  const variants = {
    /* PRIMARY – brand driven */
    primary: `
      bg-[var(--color-brand-500)]
      text-white
      shadow-[0_0_20px_rgba(var(--color-brand-500-rgb),0.4)]
      hover:shadow-[0_0_30px_rgba(var(--color-brand-500-rgb),0.6)]
      border border-transparent
    `,

    /* SECONDARY – frosted glass */
    secondary: `
      bg-white/10
      backdrop-blur-md
      text-[var(--color-text-main)]
      border border-white/20
      hover:bg-white/20
      hover:border-white/40
    `,

    /* OUTLINE – neutral theme text */
    outline: `
      bg-transparent
      border border-[var(--color-text-main)]/20
      text-[var(--color-text-main)]
      hover:border-[var(--color-text-main)]/50
    `,

    /* WHITE → renamed visually but theme safe */
    surface: `
      bg-white/80
      backdrop-blur-md
      text-[var(--color-text-main)]
      hover:bg-white/90
      shadow-lg
    `,
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

      {/* Shimmer */}
      <div
        className="
          absolute inset-0
          -translate-x-full
          group-hover:animate-[shimmer_1.5s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/30
          to-transparent
          z-0
        "
      />
    </Component>
  );
};

export default Button;
