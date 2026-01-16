import React, { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
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
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
      secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border-transparent',
      outline: 'bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800',
      ghost: 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-800 hover:text-zinc-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
    };

    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-lg border
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-zinc-600
    `;

    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${widthClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {icon && <span>{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;