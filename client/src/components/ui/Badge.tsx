import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

const Badge = ({
    children,
    variant = 'default',
    className = ''
}: BadgeProps) => {
    const variantStyles = {
        default: 'bg-gray-100 text-gray-800 ring-gray-300',
        success: 'bg-[#10B981]/10 text-[#10B981] ring-[#10B981]/30',
        warning: 'bg-[#F59E0B]/10 text-[#F59E0B] ring-[#F59E0B]/30',
        danger: 'bg-[#EF4444]/10 text-[#EF4444] ring-[#EF4444]/30',
        info: 'bg-[#3B82F6]/10 text-[#3B82F6] ring-[#3B82F6]/30',
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5",
                "text-xs font-medium ring-1 ring-inset",
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;