'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import the 3D model component to avoid SSR issues
const PropertyModel3D = dynamic(() => import('./PropertyModel3D'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full w-full min-h-[400px]">
            <div className="animate-pulse text-lg text-center">
                Loading 3D Model...
            </div>
        </div>
    ),
});

type PropertyData = {
    id: number;
    name: string;
    location: string;
    type: 'apartment' | 'house' | 'building';
    description: string;
    details: {
        size: number;
        bedrooms?: number;
        floors?: number;
        yearBuilt: number;
        rentalYield: number;
    };
};

type PropertyModelModalProps = {
    isOpen: boolean;
    onClose: () => void;
    properties: PropertyData[];
};

const PropertyModelModal: React.FC<PropertyModelModalProps> = ({
    isOpen,
    onClose,
    properties,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [colorScheme, setColorScheme] = useState<'modern' | 'classic' | 'german'>('german');
    const [isInfoVisible, setIsInfoVisible] = useState(true);

    // Get current property
    const currentProperty = properties[currentIndex] || properties[0];

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrevious();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, currentIndex, properties.length]);

    // Handle next and previous
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % properties.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
    };

    // Format number as currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                    onClick={onClose}
                >
                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with controls */}
                        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="text-primary">3D</span> Immobilienmodelle
                                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 hidden sm:inline-block">
                                    (Nutzen Sie die Pfeiltasten zum Navigieren)
                                </span>
                            </h2>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setColorScheme('modern')}
                                    className={`w-6 h-6 rounded-full border-2 ${colorScheme === 'modern' ? 'border-primary' : 'border-transparent'}`}
                                    style={{ background: 'linear-gradient(135deg, #2c3e50, #3498db)' }}
                                    title="Modern"
                                />
                                <button
                                    onClick={() => setColorScheme('classic')}
                                    className={`w-6 h-6 rounded-full border-2 ${colorScheme === 'classic' ? 'border-primary' : 'border-transparent'}`}
                                    style={{ background: 'linear-gradient(135deg, #8b4513, #cd853f)' }}
                                    title="Classic"
                                />
                                <button
                                    onClick={() => setColorScheme('german')}
                                    className={`w-6 h-6 rounded-full border-2 ${colorScheme === 'german' ? 'border-primary' : 'border-transparent'}`}
                                    style={{ background: 'linear-gradient(90deg, #000000 33%, #dd0000 33%, #dd0000 66%, #ffcc00 66%)' }}
                                    title="German"
                                />
                                <button
                                    onClick={onClose}
                                    className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            {/* 3D Model Display */}
                            <div className="flex-1 relative min-h-[350px] bg-gray-100 dark:bg-gray-800">
                                <PropertyModel3D
                                    propertyType={currentProperty.type}
                                    colorScheme={colorScheme}
                                    height={400}
                                    width={500}
                                    className="absolute inset-0"
                                />

                                {/* Navigation Controls */}
                                <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-4 z-10">
                                    <button
                                        onClick={handlePrevious}
                                        className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Info Toggle */}
                                <button
                                    onClick={() => setIsInfoVisible(!isInfoVisible)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={isInfoVisible
                                                ? "M13 10V3L4 14h7v7l9-11h-7z"
                                                : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            }
                                        />
                                    </svg>
                                </button>

                                {/* Page Indicator */}
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm">
                                    {currentIndex + 1} / {properties.length}
                                </div>
                            </div>

                            {/* Property Information Panel */}
                            <AnimatePresence>
                                {isInfoVisible && (
                                    <motion.div
                                        initial={{ x: '100%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: '100%', opacity: 0 }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                        className="w-full md:w-80 md:min-w-[320px] bg-white dark:bg-gray-900 overflow-y-auto border-t md:border-t-0 md:border-l dark:border-gray-700"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold mb-1">{currentProperty.name}</h3>
                                            <p className="text-primary mb-4 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {currentProperty.location}
                                            </p>

                                            <div className="mb-6">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {currentProperty.description}
                                                </p>
                                            </div>

                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                                <h4 className="font-semibold text-lg mb-3 border-b pb-2 dark:border-gray-700">
                                                    Immobilien Details
                                                </h4>
                                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                    <dt className="text-gray-600 dark:text-gray-400">Größe:</dt>
                                                    <dd className="text-right font-medium">{currentProperty.details.size} m²</dd>

                                                    {currentProperty.details.bedrooms && (
                                                        <>
                                                            <dt className="text-gray-600 dark:text-gray-400">Schlafzimmer:</dt>
                                                            <dd className="text-right font-medium">{currentProperty.details.bedrooms}</dd>
                                                        </>
                                                    )}

                                                    {currentProperty.details.floors && (
                                                        <>
                                                            <dt className="text-gray-600 dark:text-gray-400">Etagen:</dt>
                                                            <dd className="text-right font-medium">{currentProperty.details.floors}</dd>
                                                        </>
                                                    )}

                                                    <dt className="text-gray-600 dark:text-gray-400">Baujahr:</dt>
                                                    <dd className="text-right font-medium">{currentProperty.details.yearBuilt}</dd>

                                                    <dt className="text-gray-600 dark:text-gray-400">Mietrendite:</dt>
                                                    <dd className="text-right font-medium text-primary">
                                                        {currentProperty.details.rentalYield.toFixed(2).replace('.', ',')}%
                                                    </dd>
                                                </dl>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-semibold border-b pb-2 dark:border-gray-700">
                                                    Finanzielle Übersicht
                                                </h4>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Monatliche Miete</span>
                                                    <span className="font-bold">{formatCurrency(currentProperty.details.size * 15)}</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Jährliche Einnahmen</span>
                                                    <span className="font-bold">{formatCurrency(currentProperty.details.size * 15 * 12)}</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Geschätzter Wert</span>
                                                    <span className="font-bold">{formatCurrency(currentProperty.details.size * 4500)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 flex gap-4 justify-between">
                                            <button
                                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="flex-1 px-4 py-2 bg-primary text-white rounded font-medium hover:bg-primary/90 transition-colors"
                                            >
                                                Investieren
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PropertyModelModal;