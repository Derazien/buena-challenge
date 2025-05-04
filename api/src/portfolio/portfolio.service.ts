import { Injectable } from '@nestjs/common';
import { PortfolioSummary } from './models/portfolio-summary.model';
import { InvestmentOption } from './models/investment-option.model';
import { AllocateFundsInput } from './dto/allocate-funds.input';
import { InvestmentResult } from './models/investment-result.model';
import { YearlyProjection } from './models/yearly-projection.model';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LlamaService } from '../ai/llama.service';
import { PrismaService } from '../prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PortfolioService {
  private ecbApiUrl: string;
  private cacheTime: number;
  private euriborCache: { value: number; timestamp: number } | null = null;
  private cpiCache: { value: number; timestamp: number } | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly llamaService: LlamaService,
  ) {
    this.ecbApiUrl = this.configService.get<string>('ECB_API_URL', 'https://sdw-wsrest.ecb.europa.eu/service/data');
    this.cacheTime = this.configService.get<number>('MARKET_DATA_CACHE_TIME', 3600000); // Default 1 hour
  }

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    // For the MVP, we'll return mock data
    // In a real implementation, we would calculate this based on actual properties and investments
    const [euribor, cpi] = await Promise.all([
      this.getEuribor3M(),
      this.getGermanCPI(),
    ]);

    // Calculate total monthly rental income across all properties
    const properties = await this.prisma.property.findMany({
      include: {
        leases: {
          where: {
            isActive: true,
          },
        },
      },
    });

    // Sum up monthly rent from all active leases
    const monthlyRent = properties.reduce((total, property) => {
      return total + property.leases.reduce((propTotal, lease) => propTotal + lease.monthlyRent, 0);
    }, 0);

    // Create 3-year projection based on CAGR
    const cagrProjection = 0.092; // 9.2% annual growth
    const threeYearProjection: YearlyProjection[] = [];
    const currentYear = new Date().getFullYear();
    let currentAmount = monthlyRent * 12; // Start with annual rent

    for (let i = 0; i < 3; i++) {
      threeYearProjection.push({
        year: currentYear + i,
        amount: currentAmount,
      });
      currentAmount *= (1 + cagrProjection);
    }

    return {
      monthlyRentIn: monthlyRent,
      allocatedReservePercentage: 0.25, // 25% allocated to reserve
      forecastedYield: 0.068, // 6.8% forecasted yield
      euribor3M: euribor,
      germanCPI: cpi,
      cagrProjection,
      threeYearProjection,
    };
  }

  async getInvestmentOptions(surplusCash: number, riskProfile: string): Promise<InvestmentOption[]> {
    // For the MVP, we'll use the AI service to generate investment options
    const suggestions = await this.llamaService.suggestInvestment(surplusCash, riskProfile);
    
    if (Array.isArray(suggestions)) {
      return suggestions.map((item, index) => ({
        id: `inv-${Date.now()}-${index}`,
        name: item.name,
        type: item.type,
        expectedReturn: item.expectedReturn,
        risk: item.risk,
        minimumInvestment: item.minimumInvestment,
        description: item.description,
      }));
    }
    
    // Fallback to mock data if AI doesn't return expected format
    return [
      {
        id: `inv-${Date.now()}-1`,
        name: 'European REITs Index Fund',
        type: 'ETF',
        expectedReturn: '7-9% annually',
        risk: 'Medium',
        minimumInvestment: '$5,000',
        description: 'Diversified exposure to European real estate investment trusts with focus on commercial properties.',
      },
      {
        id: `inv-${Date.now()}-2`,
        name: 'Real Estate Debt Fund',
        type: 'Fund',
        expectedReturn: '5-6% annually',
        risk: 'Low-Medium',
        minimumInvestment: '$10,000',
        description: 'Invests in secured real estate debt with priority claim over equity investors.',
      },
      {
        id: `inv-${Date.now()}-3`,
        name: 'Property Development Partnership',
        type: 'Direct Investment',
        expectedReturn: '10-15% annually',
        risk: 'High',
        minimumInvestment: '$25,000',
        description: 'Direct partnership in residential development projects in growing urban centers.',
      },
    ];
  }

  async allocateFunds(input: AllocateFundsInput): Promise<InvestmentResult> {
    // For the MVP, we'll just simulate a successful allocation
    // In a real implementation, we would actually invest the funds
    return {
      success: true,
      message: `Successfully allocated $${input.amount.toLocaleString()} to investment with risk profile ${input.riskProfile}`,
      investmentId: input.investmentId,
    };
  }

  private async getEuribor3M(): Promise<number> {
    // Check cache first
    if (this.euriborCache && Date.now() - this.euriborCache.timestamp < this.cacheTime) {
      return this.euriborCache.value;
    }

    try {
      // In a real implementation, we would call the ECB API
      // For now, return a realistic mock value that would be updated daily
      const mockValue = 0.0325; // 3.25%
      this.euriborCache = { value: mockValue, timestamp: Date.now() };
      return mockValue;
    } catch (error) {
      console.error('Error fetching Euribor data:', error);
      // Return a fallback value if the API call fails
      return 0.03; // 3%
    }
  }

  private async getGermanCPI(): Promise<number> {
    // Check cache first
    if (this.cpiCache && Date.now() - this.cpiCache.timestamp < this.cacheTime) {
      return this.cpiCache.value;
    }

    try {
      // In a real implementation, we would call the ECB API
      // For now, return a realistic mock value that would be updated monthly
      const mockValue = 0.0246; // 2.46%
      this.cpiCache = { value: mockValue, timestamp: Date.now() };
      return mockValue;
    } catch (error) {
      console.error('Error fetching CPI data:', error);
      // Return a fallback value if the API call fails
      return 0.025; // 2.5%
    }
  }
} 