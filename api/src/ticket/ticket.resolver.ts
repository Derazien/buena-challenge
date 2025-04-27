import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Ticket } from './models/ticket.model';
import { TicketFiltersInput } from './dto/ticket-filters.input';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { DeleteTicketResponse } from './dto/delete-ticket.response';

@Resolver(() => Ticket)
export class TicketResolver {
    constructor(private prisma: PrismaService) { }

    @Query(() => [Ticket])
    async tickets(@Args('filters', { nullable: true }) filters?: TicketFiltersInput): Promise<Ticket[]> {
        console.log('Received filters:', filters);

        const where: any = {};

        if (filters) {
            if (filters.status) {
                console.log(`Filtering by status: ${filters.status}`);
                where.status = filters.status.toUpperCase();
            }

            if (filters.priority) {
                console.log(`Filtering by priority: ${filters.priority}`);
                where.priority = filters.priority.toUpperCase();
            }

            if (filters.propertyId) {
                console.log(`Filtering by propertyId: ${filters.propertyId}`);
                where.propertyId = filters.propertyId;
            }

            if (filters.searchQuery && filters.searchQuery.trim()) {
                console.log(`Filtering by searchQuery: ${filters.searchQuery}`);
                const searchTerm = filters.searchQuery.trim();
                where.OR = [
                    { title: { contains: searchTerm } },
                    { description: { contains: searchTerm } }
                ];
            }
        }

        console.log('Final query where clause:', JSON.stringify(where, null, 2));

        try {
            const tickets = await this.prisma.ticket.findMany({
                where,
                include: {
                    property: true
                },
                orderBy: { createdAt: 'desc' }
            });

            console.log(`Found ${tickets.length} tickets matching filters`);

            // Add propertyAddress field to each ticket and normalize status/priority to lowercase
            return tickets.map(ticket => ({
                ...ticket,
                // Convert status and priority to lowercase for client consistency
                status: ticket.status.toLowerCase(),
                priority: ticket.priority.toLowerCase(),
                propertyAddress: ticket.property?.address || 'Unknown'
            }));
        } catch (error) {
            console.error('Prisma query error:', error);
            // Return empty array in case of error
            return [];
        }
    }

    @Query(() => Ticket)
    async ticket(@Args('id', { type: () => Int }) id: number): Promise<Ticket> {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                property: true
            }
        });

        if (!ticket) {
            throw new Error(`Ticket with ID ${id} not found`);
        }

        return {
            ...ticket,
            // Convert status and priority to lowercase for client consistency
            status: ticket.status.toLowerCase(),
            priority: ticket.priority.toLowerCase(),
            propertyAddress: ticket.property?.address || 'Unknown'
        };
    }

    @Mutation(() => Ticket)
    async createTicket(@Args('input') input: CreateTicketInput): Promise<Ticket> {
        const { propertyId, priority, status, ...rest } = input;

        // Convert status and priority to uppercase for database
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

        return {
            ...ticket,
            // Convert status and priority to lowercase for client consistency
            status: ticket.status.toLowerCase(),
            priority: ticket.priority.toLowerCase(),
            propertyAddress: ticket.property?.address || 'Unknown'
        };
    }

    @Mutation(() => Ticket)
    async updateTicket(@Args('input') input: UpdateTicketInput): Promise<Ticket> {
        const { id, priority, status, propertyId, ...rest } = input;

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

        const ticket = await this.prisma.ticket.update({
            where: { id },
            data: updateData,
            include: {
                property: true
            }
        });

        return {
            ...ticket,
            // Convert status and priority to lowercase for client consistency
            status: ticket.status.toLowerCase(),
            priority: ticket.priority.toLowerCase(),
            propertyAddress: ticket.property?.address || 'Unknown'
        };
    }

    @Mutation(() => DeleteTicketResponse)
    async deleteTicket(@Args('id', { type: () => Int }) id: number): Promise<DeleteTicketResponse> {
        try {
            await this.prisma.ticket.delete({
                where: { id }
            });

            return {
                id,
                success: true
            };
        } catch (error) {
            return {
                id,
                success: false
            };
        }
    }
}