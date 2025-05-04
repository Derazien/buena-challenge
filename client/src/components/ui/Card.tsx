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
        success: 'border-l-emerald-500',
        warning: 'border-l-amber-500',
        danger: 'border-l-destructive',
        info: 'border-l-primary',
        default: 'border-l-transparent'
    };

    return (
        <div
            className={cn(
                "bg-card text-card-foreground border rounded-lg shadow-sm",
                borderColor !== 'default' && 'border-l-4',
                borderStyles[borderColor],
                className
            )}
        >
            {children}
        </div>
    );
};

export { Card };
export default Card;