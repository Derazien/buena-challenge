'use client';

import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { NotificationProvider } from '@/components/notifications/NotificationContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Create theme context
type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    // State to store the Apollo client
    const [client, setClient] = useState<ApolloClient<any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Theme state
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            // Check user preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    useEffect(() => {
        try {
            // Client-side code
            const apiUrl = process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:5001/graphql';
            const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

            // Error handling link
            const errorLink = onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    graphQLErrors.forEach(({ message, locations, path }) => {
                        const errorInfo = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
                        console.error(errorInfo);
                    });
                }

                if (networkError) {
                    console.error(`[Network error]: ${networkError}`);

                    // Display user-friendly message for common network errors
                    if (networkError.message.includes('Failed to fetch') ||
                        networkError.message.includes('ECONNREFUSED')) {
                        setLoadError('Cannot connect to the API server. Please check if the server is running.');
                    }
                }
            });

            // Retry link for transient network errors
            const retryLink = new RetryLink({
                delay: {
                    initial: 300,
                    max: 3000,
                    jitter: true
                },
                attempts: {
                    max: 3,
                    retryIf: (error) => {
                        // Retry on network errors or 5xx server errors
                        return !!error && (error.statusCode === undefined || error.statusCode >= 500);
                    }
                }
            });

            // HTTP link to API
            const httpLink = createHttpLink({
                uri: apiUrl,
                credentials: 'include',
            });

            // Auth link - adds authorization headers
            const authLink = setContext((_, { headers }) => {
                // Get token from localStorage
                let token;
                try {
                    token = localStorage.getItem('token');
                } catch (e) {
                    console.warn('Failed to access localStorage', e);
                }

                return {
                    headers: {
                        ...headers,
                        authorization: token ? `Bearer ${token}` : '',
                    }
                };
            });

            // Initialize Apollo Client
            const apolloClient = new ApolloClient({
                link: from([errorLink, retryLink, authLink, httpLink]),
                cache: new InMemoryCache({
                    typePolicies: {
                        Query: {
                            fields: {
                                tickets: {
                                    merge(existing = [], incoming) {
                                        return [...incoming];
                                    },
                                },
                            },
                        },
                    },
                }),
                connectToDevTools: isDebug,
                defaultOptions: {
                    watchQuery: {
                        fetchPolicy: 'cache-and-network',
                        errorPolicy: 'all',
                    },
                    query: {
                        fetchPolicy: 'network-only',
                        errorPolicy: 'all',
                    },
                    mutate: {
                        errorPolicy: 'all',
                    },
                },
            });

            setClient(apolloClient);
        } catch (err) {
            console.error('Error initializing Apollo client:', err);
            setLoadError('Failed to initialize the application. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <LoadingSpinner size="large" text="Loading application..." fullPage />
            </div>
        );
    }

    if (loadError) {
        return <div className="text-red-500">{loadError}</div>;
    }

    if (!client) {
        return <div>Failed to initialize Apollo client</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ApolloProvider client={client}>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </ApolloProvider>
        </ThemeContext.Provider>
    );
}