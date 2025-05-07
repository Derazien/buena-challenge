import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { TicketFiltersInput } from './dto/ticket-filters.input';
import { Ticket } from './models/ticket.model';

@Injectable()
export class TicketService {
    constructor(private prisma: PrismaService) { }

    private mapToTicketModel(ticket: any): Ticket {
        return {
            ...ticket,
            propertyAddress: ticket.property?.address || '',
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
        const ticket = await this.prisma.ticket.create({
            data: {
                title: input.title,
                description: input.description,
                status: input.status,
                priority: input.priority,
                propertyId: input.propertyId,
            },
            include: {
                property: true,
            },
        });

        return this.mapToTicketModel(ticket);
    }

    async update(input: UpdateTicketInput): Promise<Ticket> {
        const { id, ...data } = input;
        const ticket = await this.prisma.ticket.update({
            where: { id },
            data,
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
}