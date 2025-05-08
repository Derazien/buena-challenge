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

    async suggestInvestment(surplusCash: number, riskProfile: string, marketData: any): Promise<any[]> {
        // Check if API key is configured, if not return empty array
        if (!this.openaiApiKey) {
            console.warn('OpenAI API key not configured, skipping AI suggestions');
            return [];
        }

        const prompt = `
        You are a financial advisor specializing in real estate investment strategies. 
        Analyze the following information and provide personalized investment recommendations:

        Current Market Conditions:
        - Euribor 3M: ${marketData.euribor3M}%
        - German CPI: ${marketData.germanCPI}%
        - Market Trend: ${marketData.marketTrend || 'stable'}
        - Forecasted Yield: ${marketData.forecastedYield}%

        Client Profile:
        - Available Funds: €${surplusCash.toLocaleString()}
        - Risk Profile: ${riskProfile}
        - Source of Funds: Rental Income

        Please provide investment recommendations in JSON format with the following structure:
        {
            "recommendations": [
                {
                    "id": "unique-id-for-investment",
                    "name": "Investment Name",
                    "type": "Type (e.g., ETF, Bond, REIT, etc.)",
                    "expectedReturn": "Expected annual return percentage",
                    "risk": "Risk level (Low, Medium, High)",
                    "minimumInvestment": "Minimum amount needed to invest",
                    "description": "Detailed description of the investment"
                }
            ]
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
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                        return parsed.recommendations;
                    }
                    return [];
                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    return [];
                }
            } else {
                console.error('No JSON found in response');
                return [];
            }
        } catch (error) {
            console.error('Error getting AI suggestions:', error);
            return [];
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

    async generateMaintenanceTicket(): Promise<{
        title: string;
        description: string;
        priority: string;
        suggestedAction: string;
    }> {
        // Check if API key is configured, if not return a fallback ticket
        if (!this.openaiApiKey) {
            console.warn('OpenAI API key not configured, using fallback ticket data');
            return this.getFallbackTicket();
        }

        const prompt = `
        Generate a realistic property maintenance ticket that a tenant might submit to their property manager.
        The ticket should describe a common household issue that would require maintenance, repair, or attention
        from the property management team.

        Please make the description detailed and realistic, as if written by an actual tenant.
        The description should be in English and clearly explain the issue.

        Respond with a JSON object in the following format:
        {
          "title": "Brief summarized title of the issue",
          "description": "Detailed description of the problem from the tenant's perspective",
          "priority": "LOW, MEDIUM, HIGH, or URGENT",
          "suggestedAction": "What action should be taken by the maintenance team"
        }
        `;

        try {
            const response = await axios.post(
                this.openaiUrl,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant that creates realistic property maintenance tickets.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 500,
                    temperature: 0.8
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
                    const parsed = JSON.parse(jsonMatch[0]);
                    return {
                        title: parsed.title || 'Maintenance Issue',
                        description: parsed.description || 'Issue needs attention from maintenance team',
                        priority: parsed.priority || 'MEDIUM',
                        suggestedAction: parsed.suggestedAction || 'Inspect and resolve the issue'
                    };
                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    return this.getFallbackTicket();
                }
            } else {
                console.error('No JSON found in response');
                return this.getFallbackTicket();
            }
        } catch (error) {
            console.error('Error generating maintenance ticket:', error);
            return this.getFallbackTicket();
        }
    }

    async processMaintenanceTicket(description: string): Promise<{
        resolution: string;
        actionTaken: string;
        notes: string;
    }> {
        // Check if API key is configured, if not return a fallback response
        if (!this.openaiApiKey) {
            console.warn('OpenAI API key not configured, using fallback resolution data');
            return this.getFallbackResolution();
        }

        const prompt = `
        You are an AI maintenance assistant for a property management company.
        Analyze the following maintenance ticket description and determine:
        
        1. What is the appropriate resolution
        2. What actions should be taken
        3. Any additional notes for the property management team
        
        Ticket description: "${description}"
        
        Respond with a JSON object in the following format:
        {
          "resolution": "A brief description of how the issue was resolved",
          "actionTaken": "Detailed steps of what maintenance actions were performed",
          "notes": "Any additional notes or recommendations for follow-up"
        }
        `;

        try {
            const response = await axios.post(
                this.openaiUrl,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful AI maintenance assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 500,
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
                    const parsed = JSON.parse(jsonMatch[0]);
                    return {
                        resolution: parsed.resolution || 'Issue resolved',
                        actionTaken: parsed.actionTaken || 'Maintenance performed necessary repairs',
                        notes: parsed.notes || 'No additional notes'
                    };
                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    return this.getFallbackResolution();
                }
            } else {
                console.error('No JSON found in response');
                return this.getFallbackResolution();
            }
        } catch (error) {
            console.error('Error processing maintenance ticket:', error);
            return this.getFallbackResolution();
        }
    }

    private getFallbackTicket(): { title: string; description: string; priority: string; suggestedAction: string } {
        const tickets = [
            {
                title: 'Leaking kitchen faucet',
                description: 'I noticed a slow but persistent leak from the kitchen sink faucet. Water is dripping about once every 5 seconds, even when the faucet is completely turned off. I tried tightening the handle but it didn\'t help. The dripping is starting to cause water stains in the sink basin.',
                priority: 'MEDIUM',
                suggestedAction: 'Inspect faucet and replace washers or cartridge as needed'
            },
            {
                title: 'Bathroom ceiling water damage',
                description: 'There\'s a growing water stain on the bathroom ceiling directly below the upstairs neighbor\'s bathroom. The ceiling drywall is starting to bubble slightly and feels damp to the touch. This started about two days ago and seems to be getting worse.',
                priority: 'HIGH',
                suggestedAction: 'Investigate leak from upstairs unit, repair plumbing, and replace damaged ceiling material'
            },
            {
                title: 'Air conditioning not cooling',
                description: 'Our AC unit is running constantly but not cooling the apartment effectively. The thermostat is set to 72°F, but the actual temperature hasn\'t dropped below 80°F for the past two days. I\'ve changed the filter recently and made sure all vents are open.',
                priority: 'HIGH',
                suggestedAction: 'Check refrigerant levels, inspect compressor, and ensure proper system operation'
            }
        ];
        
        return tickets[Math.floor(Math.random() * tickets.length)];
    }

    private getFallbackResolution(): { resolution: string; actionTaken: string; notes: string } {
        const resolutions = [
            {
                resolution: 'Faucet leak fixed',
                actionTaken: 'Replaced worn cartridge in kitchen faucet and installed new O-rings. Tested water flow and confirmed no leaks.',
                notes: 'Faucet is an older model and may need full replacement within the next year. Added to preventative maintenance schedule.'
            },
            {
                resolution: 'Ceiling water damage repaired',
                actionTaken: 'Located and repaired leaky pipe connection in upstairs unit. Removed damaged drywall, treated area for mold prevention, and installed new drywall section. Painted to match existing ceiling.',
                notes: 'Recommended inspection of similar pipe connections in other units as this appears to be a common failure point in the building\'s plumbing system.'
            },
            {
                resolution: 'AC system serviced',
                actionTaken: 'Recharged refrigerant, cleaned condenser coils, and replaced worn contactor. System now cooling effectively and cycling properly.',
                notes: 'Unit is approximately 8 years old. Recommended budget planning for replacement within next 2-3 years.'
            }
        ];
        
        return resolutions[Math.floor(Math.random() * resolutions.length)];
    }
}