import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
}

/**
 * A reusable component for displaying error messages
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
    const isConnectionRefused = error.includes('ECONNREFUSED');

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <div className="text-center py-12">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-red-500 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {isConnectionRefused ? 'Connection Error' : 'Error'}
                    </h3>
                    <div className="text-red-500 mb-1">
                        {isConnectionRefused
                            ? 'Unable to connect to the server. The API server may be down or unreachable.'
                            : `Error: ${error}`}
                    </div>
                    <p className="text-gray-500 mb-4">
                        {isConnectionRefused
                            ? 'Please check that the API server is running and try again.'
                            : 'Please try again later or contact support if the problem persists.'}
                    </p>
                    {onRetry && (
                        <Button onClick={onRetry} className="mt-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Retry
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ErrorDisplay;