import { Ticket } from './tickets.types';

export interface Lease {
    id: number;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    tenantName: string;
    isActive: boolean;
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

export interface CreatePropertyInput {
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface UpdatePropertyInput {
    id: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface CreateLeaseInput {
    propertyId: number;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    tenantName: string;
    isActive: boolean;
}

export interface UpdateLeaseInput {
    id: number;
    startDate?: string;
    endDate?: string;
    monthlyRent?: number;
    tenantName?: string;
    isActive?: boolean;
}

export interface CreateCashFlowInput {
    propertyId: number;
    amount: number;
    type: 'Income' | 'Expense';
    category: string;
    date: string;
}

export interface UpdateCashFlowInput {
    id: number;
    amount?: number;
    type?: 'Income' | 'Expense';
    category?: string;
    date?: string;
}