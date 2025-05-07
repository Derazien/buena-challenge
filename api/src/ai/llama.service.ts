import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LlamaService {
    private readonly openaiApiKey: string;
    private readonly openaiUrl: string;

    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.openaiUrl = process.env.OPENAI_URL || 'https://api.openai.com/v1/chat/completions';
    }

    async suggestInvestment(surplusCash: number, riskProfile: string, marketData: any): Promise<any> {
        const prompt = `
        You are a financial advisor specializing in real estate investment strategies. 
        Analyze the following information and provide personalized investment recommendations:

        Current Market Conditions:
        - Euribor 3M: ${marketData.euribor3M}%
        - German CPI: ${marketData.germanCPI}%
        - Market Trend: ${marketData.marketTrend}
        - Forecasted Yield: ${marketData.forecastedYield}%

        Client Profile:
        - Available Funds: €${surplusCash.toLocaleString()}
        - Risk Profile: ${riskProfile}
        - Source of Funds: Rental Income

        Please provide investment recommendations in JSON format with the following structure:
        {
            "recommendations": [
                {
                    "name": "Investment Name",
                    "type": "Type (e.g., ETF, Bond, REIT, etc.)",
                    "expectedReturn": "Expected annual return percentage",
                    "risk": "Risk level (Low, Medium, High)",
                    "minimumInvestment": "Minimum amount needed to invest",
                    "description": "Detailed description of the investment",
                    "rationale": "Why this investment makes sense for the client",
                    "timeHorizon": "Recommended investment duration",
                    "liquidity": "How quickly can the investment be liquidated",
                    "taxImplications": "Brief note on tax considerations"
                }
            ],
            "overallStrategy": {
                "recommendedAllocation": "Percentage of funds to invest",
                "diversification": "How to spread the investment across options",
                "riskManagement": "Strategies to manage risk",
                "marketOutlook": "Current market analysis and future expectations"
            }
        }

        Focus on:
        1. Real estate related investments (REITs, property funds)
        2. Income-generating assets
        3. Tax-efficient strategies
        4. Risk-appropriate options based on the client's profile
        `;

        try {
            const response = await axios.post(
                this.openaiUrl,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openaiApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const text = response.data.choices[0].message.content;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0]);
                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    return this.getFallbackRecommendations(surplusCash, riskProfile);
                }
            } else {
                console.error('No JSON found in response');
                return this.getFallbackRecommendations(surplusCash, riskProfile);
            }
        } catch (error) {
            console.error('Error getting AI suggestions:', error);
            const fallback = this.getFallbackRecommendations(surplusCash, riskProfile);
            return {
                ...fallback,
                error: error?.response?.data || error?.message || String(error)
            };
        }
    }

    private getFallbackRecommendations(surplusCash: number, riskProfile: string) {
        return {
            recommendations: [
                {
                    name: 'European REITs Index Fund',
                    type: 'ETF',
                    expectedReturn: '7-9% annually',
                    risk: 'Medium',
                    minimumInvestment: '€5,000',
                    description: 'Diversified exposure to European real estate investment trusts with focus on commercial properties.',
                    rationale: 'Provides stable income and capital appreciation potential',
                    timeHorizon: '3-5 years',
                    liquidity: 'Daily',
                    taxImplications: 'Dividend income taxed at capital gains rate'
                }
            ],
            overallStrategy: {
                recommendedAllocation: '65%',
                diversification: 'Mix of REITs, bonds, and ETFs',
                riskManagement: 'Regular rebalancing and monitoring',
                marketOutlook: 'Stable with moderate growth potential'
            }
        };
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
            const response = await axios.post(this.openaiUrl, {
                model: 'gpt-3.5-turbo',
                prompt,
                stream: false,
            });

            // Extract JSON from the response
            const text = response.data.choices[0].message.content;
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