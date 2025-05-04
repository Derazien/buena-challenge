'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    animate?: boolean;
    hoverEffect?: 'lift' | 'scale' | 'glow' | 'none';
    once?: boolean;
    threshold?: number;
    borderColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
}

const AnimatedCard = ({
    children,
    className = '',
    delay = 0,
    duration = 0.5,
    animate = true,
    hoverEffect = 'lift',
    once = false,
    threshold = 0.1,
    borderColor
}: AnimatedCardProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: threshold });

    // Border color styles
    const getBorderColorClass = () => {
        if (!borderColor || borderColor === 'default') return '';

        const borderStyles: Record<string, string> = {
            primary: 'border-l-4 border-l-primary',
            success: 'border-l-4 border-l-emerald-500',
            warning: 'border-l-4 border-l-amber-500',
            danger: 'border-l-4 border-l-destructive',
            info: 'border-l-4 border-l-primary',
        };

        return borderStyles[borderColor] || '';
    };

    // Animation variants
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration,
                delay,
                ease: "easeOut"
            }
        }
    };

    // Hover effects configuration
    const getHoverEffects = () => {
        switch (hoverEffect) {
            case 'lift':
                return {
                    whileHover: { y: -8, transition: { duration: 0.2 } },
                    whileTap: { y: -4 }
                };
            case 'scale':
                return {
                    whileHover: { scale: 1.03, transition: { duration: 0.2 } },
                    whileTap: { scale: 1.01 }
                };
            case 'glow':
                return {
                    whileHover: { boxShadow: '0 0 15px rgba(120, 120, 255, 0.3)', transition: { duration: 0.2 } }
                };
            case 'none':
            default:
                return {};
        }
    };

    return (
        <motion.div
            ref={ref}
            className={cn(
                "bg-card text-card-foreground border rounded-lg shadow-sm transition-all",
                getBorderColorClass(),
                className
            )}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            {...getHoverEffects()}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;