import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
        primary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm focus:ring-[#2563EB]/50',
        secondary: 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm focus:ring-[#0F172A]/50',
        outline: 'border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-[#2563EB]/40',
        ghost: 'hover:bg-gray-50 text-gray-700 focus:ring-[#2563EB]/30',
    };

    const sizeStyles = {
        sm: 'text-sm py-1 px-3',
        md: 'py-2 px-4',
        lg: 'text-lg py-3 px-6',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                props.disabled ? 'opacity-60 cursor-not-allowed' : '',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;