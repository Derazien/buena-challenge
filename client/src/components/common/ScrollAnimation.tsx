'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'rotate';

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    type?: AnimationType;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

const ScrollAnimation = ({
    children,
    className = '',
    type = 'fade',
    delay = 0,
    duration = 0.6,
    threshold = 0.1,
    once = true
}: ScrollAnimationProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: threshold });

    // Animation variants
    const getAnimationVariants = () => {
        switch (type) {
            case 'fade':
                return {
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
            case 'slide-up':
                return {
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
            case 'slide-down':
                return {
                    hidden: { opacity: 0, y: -40 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
            case 'slide-left':
                return {
                    hidden: { opacity: 0, x: 40 },
                    visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
            case 'slide-right':
                return {
                    hidden: { opacity: 0, x: -40 },
                    visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
            case 'zoom':
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
            case 'rotate':
                return {
                    hidden: { opacity: 0, rotate: -5 },
                    visible: {
                        opacity: 1,
                        rotate: 0,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
            default:
                return {
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { duration, delay, ease: "easeOut" }
                    }
                };
        }
    };

    const variants = getAnimationVariants();

    return (
        <motion.div
            ref={ref}
            className={cn("", className)}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {children}
        </motion.div>
    );
};

export default ScrollAnimation;