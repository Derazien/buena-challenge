import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LlamaService {
    private readonly ollamaUrl: string;

    constructor() {
        this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    }

    async suggestInvestment(surplusCash: number, riskProfile: string): Promise<any> {
        const prompt = `
      You are a financial advisor helping a property owner invest their surplus cash.
      Surplus cash amount: $${surplusCash}
      Risk profile: ${riskProfile}

      Please suggest 3 investment options in JSON format with the following structure:
      [
        {
          "name": "Investment Name",
          "type": "Type (e.g., ETF, Bond, etc.)",
          "expectedReturn": "Expected annual return percentage",
          "risk": "Risk level description",
          "minimumInvestment": "Minimum amount needed to invest",
          "description": "Brief description of the investment"
        }
      ]
    `;

        try {
            const response = await axios.post(this.ollamaUrl, {
                model: 'llama3:8b',
                prompt,
                stream: false,
            });

            // Extract JSON from the response
            const text = response.data.response;
            const jsonMatch = text.match(/\\[.*?\\]/s) || text.match(/\\{.*?\\}/s);

            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0].replace(/\\n/g, ''));
                } catch (e) {
                    return { error: 'Failed to parse JSON response', raw: text };
                }
            } else {
                return { error: 'No JSON found in response', raw: text };
            }
        } catch (error) {
            return { error: error.message };
        }
    }

    async classifyTicket(description: string): Promise<any> {
        const prompt = `
      You are a property management assistant. Classify the following maintenance ticket:

      "${description}"

      Return a JSON object with the following structure:
      {
        "title": "Brief summarized title of the issue",
        "priority": "LOW, MEDIUM, HIGH, or URGENT",
        "category": "Plumbing, Electrical, HVAC, Structural, Appliance, or Other",
        "estimatedTimeToFix": "Estimated time in hours or days",
        "suggestedAction": "What action should be taken"
      }
    `;

        try {
            const response = await axios.post(this.ollamaUrl, {
                model: 'llama3:8b',
                prompt,
                stream: false,
            });

            // Extract JSON from the response
            const text = response.data.response;
            const jsonMatch = text.match(/\\{.*?\\}/s);

            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0].replace(/\\n/g, ''));
                } catch (e) {
                    return { error: 'Failed to parse JSON response', raw: text };
                }
            } else {
                return { error: 'No JSON found in response', raw: text };
            }
        } catch (error) {
            return { error: error.message };
        }
    }
}