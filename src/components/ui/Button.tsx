import React, { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon';
  className?: string;
  iconOnly?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      icon,
      fullWidth = false,
      size = 'md',
      variant = 'primary',
      className = '',
      iconOnly = false,
      ...props
    },
    ref
  ) => {
    // Icon-only sizes (square buttons)
    const iconSizeClasses = {
      sm: 'w-8 h-8 p-1.5',
      md: 'w-10 h-10 p-2',
      lg: 'w-12 h-12 p-3',
    };

    // Regular button sizes
    const sizeClasses = {
      sm: 'p-3 text-sm',
      md: 'p-4 text-base',
      lg: 'p-6 text-lg',
    };

    const variantClasses = {
      primary: 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]',
      secondary: 'bg-white/5 text-white border-white/10 backdrop-blur-md hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]',
      outline: 'bg-transparent text-white border-white/30 backdrop-blur-sm hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]',
      ghost: 'bg-transparent text-white/80 border-transparent hover:bg-white/10 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]',
      danger: 'bg-red-500/20 text-white border-red-500/30 backdrop-blur-md hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]',
      icon: 'bg-transparent text-white/70 border-transparent hover:bg-white/10 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]',
    };

    const baseClasses = `
      cursor-pointer inline-flex items-center justify-center
      font-rajdhani font-semibold rounded-lg border uppercase tracking-tight
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-white/30
    `;

    const widthClasses = fullWidth ? 'w-full' : '';
    const gapClasses = !iconOnly && children && icon ? 'gap-2' : '';
    const appliedSizeClasses = iconOnly || (!children && icon) ? iconSizeClasses[size] : sizeClasses[size];

    const buttonClasses = `
      ${baseClasses}
      ${appliedSizeClasses}
      ${variantClasses[variant]}
      ${widthClasses}
      ${gapClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {icon && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;