import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    borderColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
}

const Card = ({ children, className = '', borderColor = 'default' }: CardProps) => {
    const borderStyles = {
        primary: 'border-t-[#2563EB]', // buena-primary
        success: 'border-t-[#10B981]', // buena-success
        warning: 'border-t-[#F59E0B]', // buena-warning
        danger: 'border-t-[#EF4444]', // buena-danger
        info: 'border-t-[#3B82F6]', // buena-info
        default: 'border-t-transparent'
    };

    return (
        <div
            className={cn(
                "bg-white rounded-lg shadow-md p-6",
                "border border-gray-200/30",
                "border-t-2",
                borderStyles[borderColor],
                "hover:shadow-lg transition-shadow duration-300",
                className
            )}
        >
            {children}
        </div>
    );
};

export default Card;