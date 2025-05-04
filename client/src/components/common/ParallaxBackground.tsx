'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxBackgroundProps {
    backgroundUrl?: string;
    backgroundClassName?: string;
    overlayClassName?: string;
    height?: string;
    speed?: number;
    children?: React.ReactNode;
}

const ParallaxBackground = ({
    backgroundUrl,
    backgroundClassName,
    overlayClassName,
    height = '400px',
    speed = 0.5,
    children
}: ParallaxBackgroundProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    // Control the parallax speed with the speed prop
    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`]);

    return (
        <div
            ref={ref}
            className="relative overflow-hidden"
            style={{ height }}
        >
            <motion.div
                className={cn(
                    "absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10",
                    backgroundClassName
                )}
                style={{
                    y,
                    backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
                    scale: 1.2 // Slightly larger to cover the area during motion
                }}
            />

            {/* Overlay for better text readability */}
            {overlayClassName && (
                <div className={cn("absolute inset-0 -z-5", overlayClassName)} />
            )}

            {/* Content container */}
            <div className="relative h-full z-10 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default ParallaxBackground;