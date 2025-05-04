import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Ticket } from '../models/ticket.model';
import { TicketFiltersDto } from '../dto/ticket-filters.dto';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { DeleteTicketResponseDto } from '../dto/delete-ticket-response.dto';

@Injectable()
export class TicketService {
    constructor(private prisma: PrismaService) { }

    /**
     * Find all tickets with optional filtering
     */
    async findAll(filters?: TicketFiltersDto): Promise<Ticket[]> {
        const where: any = {};

        if (filters) {
            if (filters.status) {
                where.status = filters.status.toUpperCase();
            }

            if (filters.priority) {
                where.priority = filters.priority.toUpperCase();
            }

            if (filters.propertyId) {
                where.propertyId = filters.propertyId;
            }

            if (filters.searchQuery && filters.searchQuery.trim()) {
                const searchTerm = filters.searchQuery.trim();
                where.OR = [
                    { title: { contains: searchTerm } },
                    { description: { contains: searchTerm } }
                ];
            }
        }

        try {
            const tickets = await this.prisma.ticket.findMany({
                where,
                include: {
                    property: true
                },
                orderBy: { createdAt: 'desc' }
            });

            // Normalize fields for client
            return tickets.map(ticket => this.normalizeTicket(ticket));
        } catch (error) {
            console.error('Error finding tickets:', error);
            return [];
        }
    }

    /**
     * Find a single ticket by ID
     */
    async findOne(id: number): Promise<Ticket> {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                property: true
            }
        });

        if (!ticket) {
            throw new Error(`Ticket with ID ${id} not found`);
        }

        return this.normalizeTicket(ticket);
    }

    /**
     * Create a new ticket
     */
    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        const { propertyId, priority, status, ...rest } = createTicketDto;

        try {
            const ticket = await this.prisma.ticket.create({
                data: {
                    ...rest,
                    priority: priority.toUpperCase(),
                    status: status.toUpperCase(),
                    property: {
                        connect: { id: propertyId }
                    }
                },
                include: {
                    property: true
                }
            });

            return this.normalizeTicket(ticket);
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw new Error(`Failed to create ticket: ${error.message}`);
        }
    }

    /**
     * Update an existing ticket
     */
    async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        const { priority, status, propertyId, ...rest } = updateTicketDto;

        // Prepare update data with case conversion
        const updateData: any = { ...rest };

        if (priority) {
            updateData.priority = priority.toUpperCase();
        }

        if (status) {
            updateData.status = status.toUpperCase();
        }

        if (propertyId) {
            updateData.property = {
                connect: { id: propertyId }
            };
        }

        try {
            const ticket = await this.prisma.ticket.update({
                where: { id },
                data: updateData,
                include: {
                    property: true
                }
            });

            return this.normalizeTicket(ticket);
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw new Error(`Failed to update ticket: ${error.message}`);
        }
    }

    /**
     * Delete a ticket
     */
    async delete(id: number): Promise<DeleteTicketResponseDto> {
        try {
            await this.prisma.ticket.delete({
                where: { id }
            });

            return {
                id,
                success: true
            };
        } catch (error) {
            console.error('Error deleting ticket:', error);
            return {
                id,
                success: false
            };
        }
    }

    /**
     * Helper to normalize ticket fields for client
     */
    private normalizeTicket(ticket: any): Ticket {
        return {
            ...ticket,
            status: ticket.status.toLowerCase(),
            priority: ticket.priority.toLowerCase(),
            propertyAddress: ticket.property?.address || 'Unknown'
        };
    }
}