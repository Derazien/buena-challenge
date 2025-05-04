import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Ticket } from '../models/ticket.model';
import { TicketService } from '../services/ticket.service';
import { TicketFiltersDto } from '../dto/ticket-filters.dto';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { DeleteTicketResponseDto } from '../dto/delete-ticket-response.dto';
import { Logger } from '@nestjs/common';

@Resolver(() => Ticket)
export class TicketResolver {
    private readonly logger = new Logger(TicketResolver.name);

    constructor(private readonly ticketService: TicketService) { }

    @Query(() => [Ticket])
    async tickets(@Args('filters', { nullable: true }) filters?: TicketFiltersDto): Promise<Ticket[]> {
        this.logger.log(`Finding tickets with filters: ${JSON.stringify(filters)}`);
        return this.ticketService.findAll(filters);
    }

    @Query(() => Ticket)
    async ticket(@Args('id', { type: () => Int }) id: number): Promise<Ticket> {
        this.logger.log(`Finding ticket with id: ${id}`);
        return this.ticketService.findOne(id);
    }

    @Mutation(() => Ticket)
    async createTicket(@Args('input') input: CreateTicketDto): Promise<Ticket> {
        this.logger.log(`Creating ticket: ${JSON.stringify(input)}`);
        return this.ticketService.create(input);
    }

    @Mutation(() => Ticket)
    async updateTicket(@Args('input') input: UpdateTicketDto): Promise<Ticket> {
        this.logger.log(`Updating ticket ${input.id}: ${JSON.stringify(input)}`);
        return this.ticketService.update(input.id, input);
    }

    @Mutation(() => DeleteTicketResponseDto)
    async deleteTicket(@Args('id', { type: () => Int }) id: number): Promise<DeleteTicketResponseDto> {
        this.logger.log(`Deleting ticket with id: ${id}`);
        return this.ticketService.delete(id);
    }
}