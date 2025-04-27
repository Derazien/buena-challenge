import { Property } from './property.types';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    propertyId: number;
    property?: Property;
    propertyAddress?: string;
    createdBy?: number;
    createdAt: string;
    updatedAt: string;
}

export interface TicketFormInput {
    title?: string;
    description: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    propertyId?: number;
    useAI?: boolean;
}

export interface CreateTicketInput {
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    propertyId: number;
}

export interface UpdateTicketInput {
    id: number;
    title?: string;
    description?: string;
    priority?: TicketPriority;
    status?: TicketStatus;
}

export interface TicketFilterOptions {
    status?: TicketStatus;
    priority?: TicketPriority;
    searchQuery?: string;
    propertyId?: number;
}