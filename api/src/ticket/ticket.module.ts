import { Module } from '@nestjs/common';
import { TicketResolver } from './ticket.resolver';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [TicketResolver, PrismaService],
    exports: [TicketResolver]
})
export class TicketModule { }