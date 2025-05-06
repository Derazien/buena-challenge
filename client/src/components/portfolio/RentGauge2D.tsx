'use client';

import React, { useEffect, useState, useRef } from 'react';

type RentGauge2DProps = {
    monthlyRent?: number;
    targetAmount?: number;
    height?: number;
    className?: string;
};

const RentGauge2D: React.FC<RentGauge2DProps> = ({
    monthlyRent = 12500,
    targetAmount = 18000,
    height = 400,
    className
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    // Calculate percentage
    const percentageFilled = Math.min(1, monthlyRent / targetAmount);
    const percentage = Math.round(percentageFilled * 100);

    // Color palette based on German flag colors with professional adjustments
    const getMainColor = () => {
        if (percentageFilled > 0.8) return '#107a4b'; // German green (darker)
        if (percentageFilled > 0.5) return '#dd0000'; // German red
        return '#8b0000'; // Dark red for low values
    };

    const getSecondaryColor = () => {
        if (percentageFilled > 0.8) return '#10b981'; // Lighter green
        if (percentageFilled > 0.5) return '#ff4d4d'; // Lighter red
        return '#cc0000'; // Medium red
    };

    const getAccentColor = () => {
        return '#efb80a'; // Gold accent (German flag)
    };

    // Animation timing
    useEffect(() => {
        if (isInView && !isAnimated) {
            setTimeout(() => setIsAnimated(true), 100);
        }
    }, [isInView, isAnimated]);

    // Handle scroll for animation
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            // Get container position
            const rect = containerRef.current.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            setIsInView(isVisible);

            // Calculate normalized scroll position (0 to 1)
            const scrollMax = document.body.scrollHeight - window.innerHeight;
            const normalized = Math.min(1, Math.max(0, window.scrollY / scrollMax));
            setScrollPosition(normalized);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate animation values based on scroll
    const scale = 1 + (scrollPosition * 0.2) + (isHovered ? 0.05 : 0);
    const rotation = scrollPosition * 180 + (isHovered ? 10 : 0); // Rotation based on scroll

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                height,
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Premium background with gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                opacity: 1,
                zIndex: 0
            }} />

            {/* German flag-inspired accent stripes */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '8px',
                background: 'linear-gradient(90deg, #000000 33%, #dd0000 33%, #dd0000 66%, #efb80a 66%)',
                opacity: 0.8,
                zIndex: 1
            }} />

            {/* Advanced 3D-like donut chart */}
            <div style={{
                position: 'relative',
                width: '240px',
                height: '240px',
                transform: isAnimated ? `scale(${scale}) rotate(${rotation}deg)` : 'scale(0.8) rotate(0deg)',
                transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 1,
                marginTop: '10px'
            }}>
                {/* Shadow element for 3D depth */}
                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '5%',
                    width: '90%',
                    height: '90%',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.15)',
                    filter: 'blur(15px)',
                    transform: isAnimated ? 'translateY(10px)' : 'translateY(0px)',
                    transition: 'transform 1s ease, filter 1s ease',
                    zIndex: 0
                }} />

                {/* Multiple background rings for layered 3D effect */}
                {[...Array(3)].map((_, i) => (
                    <div key={`bg-ring-${i}`} style={{
                        position: 'absolute',
                        top: `${2 + i * 1}%`,
                        left: `${2 + i * 1}%`,
                        width: `${96 - i * 2}%`,
                        height: `${96 - i * 2}%`,
                        borderRadius: '50%',
                        background: i === 0 ? '#e2e8f0' : i === 1 ? '#f1f5f9' : '#e2e8f0',
                        boxShadow: i === 0 ? 'inset 0 4px 8px rgba(0, 0, 0, 0.15)' : 'none',
                        transform: isAnimated ? `rotate(${-5 + i * 2}deg)` : 'rotate(0deg)',
                        transition: `transform ${0.8 + i * 0.2}s ease-out`,
                        opacity: isAnimated ? 1 : 0.5,
                        zIndex: 1 + i
                    }} />
                ))}

                {/* Main progress ring with enhanced gradient and 3D effect */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '80%',
                    height: '80%',
                    borderRadius: '50%',
                    background: `conic-gradient(
                        ${getMainColor()} ${percentage}%,
                        transparent ${percentage}% ${percentage + 0.5}%,
                        rgba(226, 232, 240, 0.2) ${percentage + 0.5}% 100%
                    )`,
                    boxShadow: `
                        0 6px 12px rgba(0, 0, 0, 0.1),
                        0 -2px 6px ${getMainColor()}40,
                        inset 0 2px 6px rgba(255, 255, 255, 0.15)
                    `,
                    transform: isAnimated ? `rotate(${isHovered ? 15 : 5}deg)` : 'rotate(0deg)',
                    transition: 'transform 1s ease-out, box-shadow 0.3s ease',
                    zIndex: 4,
                    animation: isAnimated ? 'pulse 3s infinite alternate' : 'none'
                }} />

                {/* Secondary progress ring for glow effect */}
                <div style={{
                    position: 'absolute',
                    top: '12%',
                    left: '12%',
                    width: '76%',
                    height: '76%',
                    borderRadius: '50%',
                    background: `conic-gradient(
                        ${getSecondaryColor()}90 ${percentage}%,
                        transparent ${percentage}% 100%
                    )`,
                    filter: 'blur(6px)',
                    opacity: isHovered ? 0.7 : 0.4,
                    transform: isAnimated ? `rotate(${isHovered ? -10 : -2}deg)` : 'rotate(0deg)',
                    transition: 'transform 1s ease-out, opacity 0.3s ease',
                    zIndex: 3
                }} />

                {/* Inner circle with enhanced 3D effect */}
                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '25%',
                    width: '50%',
                    height: '50%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, white, #f8fafc)',
                    boxShadow: `
                        0 4px 15px rgba(0, 0, 0, 0.1),
                        inset 0 -3px 6px rgba(0, 0, 0, 0.05),
                        inset 0 2px 2px rgba(255, 255, 255, 0.8)
                    `,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5,
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s ease',
                }}>
                    {/* Percentage display with shadow for depth */}
                    <div style={{
                        fontSize: '2.6rem',
                        fontWeight: 'bold',
                        color: getMainColor(),
                        textAlign: 'center',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        transform: isAnimated ? 'scale(1)' : 'scale(0.8)',
                        opacity: isAnimated ? 1 : 0,
                        transition: 'transform 0.8s ease, opacity 0.8s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 5
                    }}>
                        {percentage}
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: getMainColor(),
                            opacity: 0.8
                        }}>%</span>
                    </div>

                    {/* Accent highlight */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: `radial-gradient(circle at 30% 30%, ${getAccentColor()}30, transparent 70%)`,
                        opacity: isHovered ? 0.4 : 0.2,
                        transition: 'opacity 0.3s ease',
                        mixBlendMode: 'overlay',
                        zIndex: 6
                    }} />
                </div>

                {/* Decorative German-inspired dot indicators */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const x = 50 + 46 * Math.cos(angle);
                    const y = 50 + 46 * Math.sin(angle);
                    const isInRange = (i / 12) * 100 < percentage;

                    return (
                        <div key={`indicator-${i}`} style={{
                            position: 'absolute',
                            top: `${y}%`,
                            left: `${x}%`,
                            width: '3%',
                            height: '3%',
                            borderRadius: '50%',
                            backgroundColor: isInRange ? getAccentColor() : '#94a3b8',
                            boxShadow: isInRange ? `0 0 8px ${getAccentColor()}90` : 'none',
                            transform: 'translate(-50%, -50%)',
                            opacity: isAnimated ? 1 : 0,
                            transition: `opacity 0.5s ease ${0.05 * i}s`,
                            zIndex: 10
                        }} />
                    );
                })}
            </div>

            {/* Enhanced text information */}
            <div style={{
                marginTop: '24px',
                textAlign: 'center',
                zIndex: 10,
                transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
                opacity: isAnimated ? 1 : 0,
                transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
                transitionDelay: '0.3s',
                padding: '0 20px',
                width: '100%',
                maxWidth: '280px'
            }}>
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)'
                }}>
                    Mieteinnahmen
                </h3>
                <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.6rem',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                }}>
                    <span style={{
                        fontSize: '1rem',
                        fontWeight: 'normal',
                        color: '#64748b',
                        marginRight: '2px'
                    }}>€</span>
                    {monthlyRent.toLocaleString('de-DE')}
                </p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0',
                    gap: '4px'
                }}>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: getMainColor(),
                            borderRadius: '3px',
                            transition: 'width 1s ease-out',
                            position: 'relative',
                            boxShadow: `0 0 8px ${getMainColor()}80`
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: isAnimated ? 'shimmer 2s infinite' : 'none'
                            }} />
                        </div>
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        color: '#64748b',
                        whiteSpace: 'nowrap'
                    }}>
                        {percentage}%
                    </p>
                </div>
                <p style={{
                    margin: '8px 0 0',
                    fontSize: '0.875rem',
                    color: '#64748b'
                }}>
                    von <span style={{ fontWeight: 'bold', color: '#334155' }}>€{targetAmount.toLocaleString('de-DE')}</span> Zielbetrag
                </p>
            </div>

            {/* Enhanced lighting effects */}
            <div style={{
                position: 'absolute',
                top: '-30%',
                left: '-30%',
                width: '160%',
                height: '160%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 60%)',
                opacity: 0.6,
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
                zIndex: 2,
                transform: isHovered ? 'translate(-5%, -5%)' : 'translate(0%, 0%)',
                transition: 'transform 0.5s ease'
            }} />

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes pulse {
                    0% { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1), 0 -2px 6px ${getMainColor()}40; }
                    100% { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 -4px 8px ${getMainColor()}60; }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default RentGauge2D;