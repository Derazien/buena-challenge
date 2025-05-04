import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LlamaService } from './llama.service';

@Module({
    controllers: [AiController],
    providers: [AiService, LlamaService],
    exports: [AiService, LlamaService],
})
export class AiModule { }