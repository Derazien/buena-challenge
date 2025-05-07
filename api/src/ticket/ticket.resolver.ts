import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Ticket } from './models/ticket.model';
import { TicketService } from './ticket.service';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { TicketFiltersInput } from './dto/ticket-filters.input';
import { DeleteTicketResponse } from './dto/delete-ticket.response';

const pubSub = new PubSub();

@Resolver(() => Ticket)
export class TicketResolver {
    constructor(private readonly ticketService: TicketService) { }

    @Query(() => [Ticket])
    async tickets(@Args('filters', { nullable: true }) filters?: TicketFiltersInput) {
        return this.ticketService.findAll(filters);
    }

    @Query(() => Ticket)
    async ticket(@Args('id', { type: () => Int }) id: number) {
        return this.ticketService.findOne(id);
    }

    @Mutation(() => Ticket)
    async createTicket(@Args('input') input: CreateTicketInput) {
        const ticket = await this.ticketService.create(input);
        pubSub.publish('ticketCreated', { ticketCreated: ticket });
        return ticket;
    }

    @Mutation(() => Ticket)
    async updateTicket(@Args('input') input: UpdateTicketInput) {
        const ticket = await this.ticketService.update(input);
        pubSub.publish('ticketUpdated', { ticketUpdated: ticket });
        return ticket;
    }

    @Mutation(() => DeleteTicketResponse)
    async deleteTicket(@Args('id', { type: () => Int }) id: number) {
        const ticket = await this.ticketService.remove(id);
        pubSub.publish('ticketDeleted', { ticketDeleted: ticket });
        return { id: ticket.id, success: true };
    }

    @Subscription(() => Ticket)
    ticketCreated() {
        return pubSub.asyncIterator('ticketCreated');
    }

    @Subscription(() => Ticket)
    ticketUpdated() {
        return pubSub.asyncIterator('ticketUpdated');
    }

    @Subscription(() => Ticket)
    ticketDeleted() {
        return pubSub.asyncIterator('ticketDeleted');
    }
}