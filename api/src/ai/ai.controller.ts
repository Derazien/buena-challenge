import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('analyze-ticket')
    async analyzeTicket(@Body('text') text: string) {
        return {
            analysis: await this.aiService.analyzeTicket(text)
        };
    }
}