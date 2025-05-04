'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface ParallaxContainerProps {
    children: ReactNode;
    offsetMultiplier?: number; // Controls the intensity of the parallax effect
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

const ParallaxContainer = ({
    children,
    offsetMultiplier = 0.5,
    className = '',
    direction = 'up'
}: ParallaxContainerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    let transformY: MotionValue<string> | undefined;
    let transformX: MotionValue<string> | undefined;

    // Apply different directional transforms based on the direction prop
    switch (direction) {
        case 'up':
            transformY = useTransform(scrollYProgress, [0, 1], ['0%', `${-20 * offsetMultiplier}%`]);
            break;
        case 'down':
            transformY = useTransform(scrollYProgress, [0, 1], ['0%', `${20 * offsetMultiplier}%`]);
            break;
        case 'left':
            transformX = useTransform(scrollYProgress, [0, 1], ['0%', `${-20 * offsetMultiplier}%`]);
            break;
        case 'right':
            transformX = useTransform(scrollYProgress, [0, 1], ['0%', `${20 * offsetMultiplier}%`]);
            break;
    }

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div
                style={{
                    y: transformY,
                    x: transformX
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default ParallaxContainer;