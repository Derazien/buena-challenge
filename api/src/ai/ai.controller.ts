import { Controller, Post, Body, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { LlamaService } from './llama.service';

@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly llamaService: LlamaService
    ) { }

    @Post('analyze-ticket')
    async analyzeTicket(@Body('text') text: string) {
        return {
            analysis: await this.aiService.analyzeTicket(text)
        };
    }

    @Get('test-llm')
    async testLlm() {
        console.log('test-llm endpoint called');
        try {
            const testPrompt = 'Hello, can you respond with a simple greeting?';
            const response = await this.llamaService.suggestInvestment(10000, 'MODERATE', {
                euribor3M: 3.5,
                germanCPI: 2.1,
                marketTrend: 'stable',
                forecastedYield: 5.2
            });
            console.log('LLM response:', response);
            return {
                status: 'success',
                response,
                message: 'LLM connection is working'
            };
        } catch (error) {
            console.error('LLM error:', error);
            return {
                status: 'error',
                error: error.message,
                message: 'LLM connection failed'
            };
        }
    }
}