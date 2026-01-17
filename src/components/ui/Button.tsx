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
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
      secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border-transparent',
      outline: 'bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800',
      ghost: 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-800 hover:text-zinc-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
      icon: 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-800 hover:text-white',
    };

    const baseClasses = `
      cursor-pointer inline-flex items-center justify-center
      font-medium rounded-lg border
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-zinc-600
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