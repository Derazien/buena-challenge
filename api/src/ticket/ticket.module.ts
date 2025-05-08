import { Module } from '@nestjs/common';
import { TicketResolver } from './ticket.resolver';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { LlamaService } from '../ai/llama.service';

@Module({
    providers: [TicketResolver, TicketService, PrismaService, AiService, LlamaService],
    exports: [TicketService]
})
export class TicketModule { }