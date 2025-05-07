import { Module } from '@nestjs/common';
import { TicketResolver } from './ticket.resolver';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [TicketResolver, TicketService, PrismaService],
    exports: [TicketService]
})
export class TicketModule { }