import { Controller, Post, Body } from '@nestjs/common';
import { LlamaService } from './llama.service';

@Controller('ai')
export class AiController {
    constructor(private readonly llamaService: LlamaService) { }

    @Post('suggest-investment')
    async suggestInvestment(
        @Body('surplusCash') surplusCash: number,
        @Body('riskProfile') riskProfile: string,
    ) {
        return this.llamaService.suggestInvestment(surplusCash, riskProfile);
    }

    @Post('classify-ticket')
    async classifyTicket(@Body('description') description: string) {
        return this.llamaService.classifyTicket(description);
    }
}