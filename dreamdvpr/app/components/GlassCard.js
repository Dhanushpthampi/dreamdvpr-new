'use client';

/**
 * Reusable glassmorphism card component with Tailwind CSS
 */
const GlassCard = ({
  children,
  p = 6,
  hover = true,
  onClick,
  className = '',
  ...rest
}) => {
  const paddingClass = p === 4 ? 'p-4' : p === 6 ? 'p-6' : p === 8 ? 'p-8' : p === 12 ? 'p-12' : 'p-6';
  const cursorClass = onClick ? 'cursor-pointer' : 'cursor-default';
  
  return (
    <div
      className={`glass-card ${paddingClass} ${cursorClass} ${hover ? 'hover:transform hover:-translate-y-0.5 hover:shadow-xl' : ''} transition-all duration-300 ${className}`}
      onClick={onClick}
      style={{
        boxShadow: '0 0 20px rgba(0, 171, 173, 0.12)',
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default GlassCard;
