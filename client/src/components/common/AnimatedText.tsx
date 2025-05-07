'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    staggerChildren?: number;
    type?: 'word' | 'character' | 'line';
    animation?: 'fade' | 'slide-up' | 'slide-down' | 'bounce' | 'wave';
    once?: boolean;
    threshold?: number;
}

const AnimatedText = ({
    text,
    className = '',
    delay = 0,
    duration = 0.5,
    staggerChildren = 0.05,
    type = 'word',
    animation = 'fade',
    once = false,
    threshold = 0.1
}: AnimatedTextProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: threshold });

    // Split text based on type
    const getTextArray = () => {
        switch (type) {
            case 'character':
                return text.split('');
            case 'word':
                return text.split(' ').map(word => `${word} `);
            case 'line':
                return text.split('\n');
            default:
                return [text];
        }
    };

    const textArray = getTextArray();

    // Motion variants based on animation type
    const getVariants = () => {
        // Container variants for staggering children
        const container = {
            hidden: { opacity: 0 },
            visible: (i: number = 1) => ({
                opacity: 1,
                transition: {
                    staggerChildren,
                    delayChildren: delay,
                    ease: "easeInOut"
                }
            })
        };

        // Children variants based on animation type
        let children;
        switch (animation) {
            case 'fade':
                children = {
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { duration }
                    }
                };
                break;
            case 'slide-up':
                children = {
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration }
                    }
                };
                break;
            case 'slide-down':
                children = {
                    hidden: { opacity: 0, y: -20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration }
                    }
                };
                break;
            case 'bounce':
                children = {
                    hidden: { opacity: 0, scale: 0.5 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration,
                            type: "spring",
                            damping: 12,
                            stiffness: 200
                        }
                    }
                };
                break;
            case 'wave':
                children = {
                    hidden: { opacity: 0, y: 20, rotate: -5 },
                    visible: (i: number) => ({
                        opacity: 1,
                        y: 0,
                        rotate: 0,
                        transition: {
                            duration: duration,
                            delay: i * 0.1, // Add a cascading wave effect
                            ease: [0.2, 0.65, 0.3, 0.9]
                        }
                    })
                };
                break;
            default:
                children = {
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { duration }
                    }
                };
        }

        return { container, children };
    };

    const { container, children } = getVariants();

    return (
        <motion.span
            ref={ref}
            className={cn("inline-block", className)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={container}
        >
            {textArray.map((item, index) => (
                <motion.span
                    key={index}
                    className="inline-block whitespace-pre"
                    custom={index}
                    variants={children}
                >
                    {item}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default AnimatedText;