'use client';

import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { NotificationProvider } from '@/components/notifications/NotificationContext';

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
            const wsUrl = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:5001/graphql-ws';
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

            // WebSocket link for subscriptions
            const wsLink = typeof window !== 'undefined'
                ? new GraphQLWsLink(
                    createClient({
                        url: wsUrl,
                        connectionParams: {
                            // Add authentication if needed
                            authToken: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
                        },
                        retryAttempts: 5,
                        connectionAckWaitTimeout: 10000,
                        shouldRetry: (errOrCloseEvent) => {
                            // Retry on network errors or if the server explicitly closed the connection
                            return true;
                        },
                    })
                )
                : null;

            // Split links based on operation type
            const splitLink = typeof window !== 'undefined' && wsLink
                ? split(
                    ({ query }) => {
                        const definition = getMainDefinition(query);
                        return (
                            definition.kind === 'OperationDefinition' &&
                            definition.operation === 'subscription'
                        );
                    },
                    wsLink,
                    httpLink
                )
                : httpLink;

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
                link: from([errorLink, retryLink, authLink, splitLink]),
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="text-red-500 mb-4 text-xl">⚠️ {loadError}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Reload Application
                </button>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Failed to initialize the application.</div>
            </div>
        );
    }

    return (
        <ApolloProvider client={client}>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </ThemeContext.Provider>
        </ApolloProvider>
    );
}