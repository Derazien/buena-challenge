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

    const spinnerElement = (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent`}
            ></div>
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                {spinnerElement}
            </div>
        );
    }

    return spinnerElement;
};

export default LoadingSpinner;
