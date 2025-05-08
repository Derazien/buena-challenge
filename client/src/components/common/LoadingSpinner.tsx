import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    fullPage?: boolean;
}

/**
 * A reusable loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    text,
    fullPage = false
}) => {
    const sizeClasses = {
        small: 'h-4 w-4 border-2',
        medium: 'h-8 w-8 border-2',
        large: 'h-12 w-12 border-3'
    };
    
    const outerSizeClasses = {
        small: 'h-8 w-8 border-2',
        medium: 'h-12 w-12 border-2',
        large: 'h-16 w-16 border-3'
    };

    const spinnerElement = (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                {/* Outer progress circle */}
                <div className={`${outerSizeClasses[size]} rounded-full border-primary/30 border-dashed animate-spin-slow`}></div>
                
                {/* Inner spinner */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`${sizeClasses[size]} animate-spin-reverse rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent`}></div>
                </div>
            </div>
            {text && <p className="mt-4 text-muted-foreground">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                {spinnerElement}
            </div>
        );
    }

    return spinnerElement;
};

export default LoadingSpinner;
