import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    borderColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
}

const Card = ({ children, className = '', borderColor = 'default' }: CardProps) => {
    const borderStyles = {
        primary: 'border-l-primary', 
        success: 'border-l-green-500',
        warning: 'border-l-yellow-500',
        danger: 'border-l-red-500',
        info: 'border-l-blue-500',
        default: 'border-l-transparent'
    };

    return (
        <div
            className={cn(
                "dark:border-neutral-700 border-stone-200 border rounded-xl dark:bg-neutral-800 bg-background",
                borderColor !== 'default' && 'border-l-4',
                borderStyles[borderColor],
                className
            )}
        >
            {children}
        </div>
    );
};

export default Card;