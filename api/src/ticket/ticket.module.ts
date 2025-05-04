import { Module } from '@nestjs/common';
import { TicketResolver } from './resolvers/ticket.resolver';
import { TicketService } from './services/ticket.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [TicketResolver, TicketService, PrismaService],
    exports: [TicketService]
})
export class TicketModule { }