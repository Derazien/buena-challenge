import { Property } from './property.types';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'in_progress_by_ai' | 'needs_manual_review' | 'resolved';

export interface TicketAttachment {
    filename: string;
    size: number;
    type: string;
    url: string;
}

export interface TicketMetadata {
    contactPhone?: string;
    contactEmail?: string;
    estimatedCost?: string;
    dueDate?: Date;
    notes?: string;
    useAI?: boolean;
    generatedByAI?: boolean;
    actionRequired?: string;
    aiProcessed?: boolean;
    aiResolution?: string;
    aiActionTaken?: string;
    aiNotes?: string;
    aiProcessingTime?: string;
    manualReviewReason?: string;
    attachments?: TicketAttachment[];
}

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
    metadata?: TicketMetadata;
}

export interface TicketFormInput {
    title?: string;
    description: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    propertyId?: number;
    useAI?: boolean;
    contactPhone?: string;
    contactEmail?: string;
    estimatedCost?: string;
    dueDate?: string;
    notes?: string;
    attachments?: File[];
    existingAttachments?: TicketAttachment[];
}

export interface CreateTicketInput {
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    propertyId: number;
    metadata?: TicketMetadata;
}

export interface UpdateTicketInput {
    id: number;
    title?: string;
    description?: string;
    priority?: TicketPriority;
    status?: TicketStatus;
    metadata?: TicketMetadata;
}

export interface TicketFilterOptions {
    status?: TicketStatus;
    priority?: TicketPriority;
    searchQuery?: string;
    propertyId?: number;
}