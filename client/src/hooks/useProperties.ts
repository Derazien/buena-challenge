import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '@/graphql/queries';

export interface Lease {
    id: number;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    tenantName: string;
    isActive: boolean;
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
}

export interface CashFlow {
    id: number;
    amount: number;
    type: string;
    category: string;
    date: string;
}

export interface Property {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    leases: Lease[];
    tickets: Ticket[];
    cashFlows: CashFlow[];
}

export function useProperties() {
    const { loading, error, data, refetch } = useQuery(GET_PROPERTIES);

    const properties: Property[] = data?.properties || [];

    return {
        loading,
        error,
        properties,
        refetch
    };
}