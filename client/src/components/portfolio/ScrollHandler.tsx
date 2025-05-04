'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import useScroll only on client-side
const useScrollImport = () => {
    const [scrollHook, setScrollHook] = useState<any>(null);

    useEffect(() => {
        // Only import in browser environment
        import('@react-three/drei').then(mod => {
            setScrollHook(() => mod.useScroll);
        });
    }, []);

    return scrollHook;
};

interface ScrollHandlerProps {
    setScrollProgress: (progress: number) => void;
}

const ScrollHandler: React.FC<ScrollHandlerProps> = ({ setScrollProgress }) => {
    const [mounted, setMounted] = useState(false);
    const useScrollHook = useScrollImport();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !useScrollHook) return;

        const scroll = useScrollHook();

        const handleScroll = () => {
            if (scroll && scroll.offset !== undefined) {
                setScrollProgress(scroll.offset);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted, useScrollHook, setScrollProgress]);

    return null;
};

export default ScrollHandler;