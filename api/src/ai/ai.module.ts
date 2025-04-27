import { Module } from '@nestjs/common';
import { LlamaService } from './llama.service';
import { AiController } from './ai.controller';

@Module({
    controllers: [AiController],
    providers: [LlamaService],
    exports: [LlamaService],
})
export class AiModule { }