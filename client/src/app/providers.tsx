'use client';

import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/lib/apollo-client';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    );
}