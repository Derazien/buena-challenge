import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { TicketFiltersInput } from './dto/ticket-filters.input';
import { Ticket, TicketMetadata } from './models/ticket.model';
import { LlamaService } from '../ai/llama.service';

@Injectable()
export class TicketService {
    constructor(
        private prisma: PrismaService,
        private llamaService: LlamaService
    ) { }

    private mapToTicketModel(ticket: any): Ticket {
        let metadata: TicketMetadata | undefined;
        if (ticket.metadata) {
            try {
                metadata = JSON.parse(ticket.metadata);
            } catch (e) {
                console.error('Error parsing ticket metadata:', e);
            }
        }

        return {
            ...ticket,
            propertyAddress: ticket.property?.address || '',
            metadata: metadata || undefined
        };
    }

    async findAll(filters?: TicketFiltersInput): Promise<Ticket[]> {
        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.priority) {
            where.priority = filters.priority;
        }

        if (filters?.propertyId) {
            where.propertyId = filters.propertyId;
        }

        if (filters?.searchQuery) {
            where.OR = [
                { title: { contains: filters.searchQuery } },
                { description: { contains: filters.searchQuery } },
            ];
        }

        const tickets = await this.prisma.ticket.findMany({
            where,
            include: {
                property: true,
            },
        });

        return tickets.map(this.mapToTicketModel);
    }

    async findOne(id: number): Promise<Ticket> {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                property: true,
            },
        });

        if (!ticket) {
            throw new Error(`Ticket with ID ${id} not found`);
        }

        return this.mapToTicketModel(ticket);
    }

    async create(input: CreateTicketInput): Promise<Ticket> {
        const { metadata, ...ticketData } = input;
        const metadataString = metadata ? JSON.stringify(metadata) : null;

        const ticket = await this.prisma.ticket.create({
            data: {
                ...ticketData,
                metadata: metadataString
            },
            include: {
                property: true,
            },
        });

        // If the ticket has metadata.useAI flag, process it with LLM
        if (metadata?.useAI) {
            this.processTicketWithLLM(ticket.id);
        }

        return this.mapToTicketModel(ticket);
    }

    async update(input: UpdateTicketInput): Promise<Ticket> {
        const { id, metadata, ...data } = input;
        
        // First, get the current ticket to merge metadata
        const currentTicket = await this.prisma.ticket.findUnique({
            where: { id }
        });

        let updatedMetadata;
        // If the ticket has existing metadata, merge it with new metadata
        if (currentTicket?.metadata && metadata) {
            try {
                const currentMetadataObj = JSON.parse(currentTicket.metadata);
                updatedMetadata = JSON.stringify({
                    ...currentMetadataObj,
                    ...metadata
                });
            } catch (e) {
                console.error('Error merging ticket metadata:', e);
                updatedMetadata = metadata ? JSON.stringify(metadata) : currentTicket.metadata;
            }
        } else {
            updatedMetadata = metadata ? JSON.stringify(metadata) : currentTicket?.metadata;
        }
        
        const ticket = await this.prisma.ticket.update({
            where: { id },
            data: {
                ...data,
                metadata: updatedMetadata
            },
            include: {
                property: true,
            },
        });

        return this.mapToTicketModel(ticket);
    }

    async remove(id: number): Promise<Ticket> {
        const ticket = await this.prisma.ticket.delete({
            where: { id },
            include: {
                property: true,
            },
        });

        return this.mapToTicketModel(ticket);
    }

    async generateTestTicket(propertyId: number): Promise<Ticket> {
        // Generate a random maintenance issue using LLM
        const ticketData = await this.llamaService.generateMaintenanceTicket();
        
        // Create the ticket with the generated data
        const metadata = {
            useAI: true,
            generatedByAI: true,
            actionRequired: ticketData.suggestedAction
        };
        
        const ticket = await this.prisma.ticket.create({
            data: {
                title: ticketData.title,
                description: ticketData.description,
                status: 'in_progress_by_ai',
                priority: ticketData.priority.toLowerCase(),
                propertyId: propertyId,
                metadata: JSON.stringify(metadata)
            },
            include: {
                property: true,
            },
        });

        // Process the ticket with LLM
        this.processTicketWithLLM(ticket.id);

        return this.mapToTicketModel(ticket);
    }

    async processTicketWithLLM(ticketId: number): Promise<void> {
        // First update status to in_progress_by_ai
        await this.prisma.ticket.update({
            where: { id: ticketId },
            data: { status: 'in_progress_by_ai' }
        });

        // Get the ticket details
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { property: true }
        });

        // Parse the existing metadata
        let metadata = {};
        if (ticket.metadata) {
            try {
                metadata = JSON.parse(ticket.metadata);
            } catch (e) {
                console.error('Error parsing ticket metadata:', e);
            }
        }

        // Process with LLM
        const llmResult = await this.llamaService.processMaintenanceTicket(ticket.description);
        
        // Wait 15 seconds to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 15000));
        
        // Randomly decide if the ticket can be auto-resolved
        const canAutoResolve = Math.random() > 0.4; // 60% chance of auto-resolving
        
        // Update the ticket with the LLM results
        await this.prisma.ticket.update({
            where: { id: ticketId },
            data: { 
                status: canAutoResolve ? 'resolved' : 'needs_manual_review',
                metadata: JSON.stringify({
                    ...metadata,
                    aiProcessed: true,
                    aiResolution: canAutoResolve ? llmResult.resolution : null,
                    aiActionTaken: canAutoResolve ? llmResult.actionTaken : null,
                    aiNotes: canAutoResolve ? llmResult.notes : 'This ticket requires manual review by staff due to complexity or policy restrictions.',
                    aiProcessingTime: new Date().toISOString(),
                    manualReviewReason: !canAutoResolve ? 'AI determined this issue requires human attention or approval before proceeding.' : null
                })
            }
        });
    }
}