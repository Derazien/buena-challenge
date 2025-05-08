import { Injectable, Logger } from '@nestjs/common';
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
import axios from 'axios';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);
  private alphaVantageApiKey: string;
  private finnhubApiKey: string;
  private plaidClientId: string;
  private plaidSecret: string;
  private plaidEnv: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly llamaService: LlamaService,
  ) {
    this.alphaVantageApiKey = this.configService.get<string>('ALPHA_VANTAGE_API_KEY');
    this.finnhubApiKey = this.configService.get<string>('FINNHUB_API_KEY');
    this.plaidClientId = this.configService.get<string>('PLAID_CLIENT_ID');
    this.plaidSecret = this.configService.get<string>('PLAID_SECRET');
    this.plaidEnv = this.configService.get<string>('PLAID_ENV', 'sandbox');
  }

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    // Get real-time market data
    const [euribor, cpi, marketIndicators] = await Promise.all([
      this.getEuribor3M(),
      this.getGermanCPI(),
      this.getMarketIndicators(),
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

    // Create 3-year projection based on real market data
    const cagrProjection = await this.calculateCAGR();
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

    // Get user investments to calculate available funds
    const investments = await this.prisma.$queryRaw`
      SELECT * FROM Investment
    `;
    const totalInvested = Array.isArray(investments) 
      ? investments.reduce((total, inv: any) => total + inv.amount, 0)
      : 0;
    
    // Calculate reserve balance (25% of total monthly rent)
    const reserveBalance = monthlyRent * 3; // 3 months of rent as reserve
    
    // Target monthly rent (20% more than current)
    const targetMonthlyRent = monthlyRent * 1.2;
    
    // Calculate available to reinvest (75% of monthly rent)
    const availableToReinvest = monthlyRent * 0.75;
    
    // Calculate available to invest (new funds - estimated)
    const availableToInvest = 25000; // Default value for new investment
    
    // Monthly growth percentage (mock data)
    const monthlyGrowth = 2.8;
    
    // Property summaries
    const propertySummaries = properties.map(property => ({
      id: property.id,
      name: `Property ${property.id}`,
      location: `${property.city}, ${property.state}`,
      monthlyRent: property.monthlyRent,
      occupancyRate: property.occupancyRate || 0.95,
    }));
    
    // Allocation breakdown (mock data)
    const allocationBreakdown = [
      { category: 'REITs', percentage: 35, amount: 87500 },
      { category: 'Bonds', percentage: 25, amount: 62500 },
      { category: 'Stocks', percentage: 30, amount: 75000 },
      { category: 'Cash', percentage: 10, amount: 25000 },
    ];
    
    // Monthly performance (mock data)
    const monthlyPerformance = [
      { month: 'Jan', income: monthlyRent * 0.95 },
      { month: 'Feb', income: monthlyRent * 0.97 },
      { month: 'Mar', income: monthlyRent * 0.99 },
      { month: 'Apr', income: monthlyRent * 1.0 },
      { month: 'May', income: monthlyRent * 1.02 },
      { month: 'Jun', income: monthlyRent * 1.03 },
    ];

    return {
      monthlyRentIn: monthlyRent,
      allocatedReservePercentage: 0.25, // 25% allocated to reserve
      forecastedYield: marketIndicators.forecastedYield,
      euribor3M: euribor,
      germanCPI: cpi,
      cagrProjection,
      threeYearProjection,
      // New fields
      availableToInvest,
      availableToReinvest,
      reserveBalance,
      monthlyGrowth,
      targetMonthlyRent,
      properties: propertySummaries,
      allocationBreakdown,
      monthlyPerformance,
    };
  }

  async getInvestmentOptions(surplusCash: number, riskProfile: string): Promise<InvestmentOption[]> {
    try {
      // Get real-time market data
      const [euribor, cpi, marketIndicators] = await Promise.all([
        this.getEuribor3M(),
        this.getGermanCPI(),
        this.getMarketIndicators(),
      ]);

      // Try to get AI suggestions, but don't let failures block the response
      let aiSuggestions = [];
      try {
        aiSuggestions = await this.llamaService.suggestInvestment(
          surplusCash,
          riskProfile,
          {
            euribor,
            cpi,
            marketIndicators
          }
        );
      } catch (error) {
        this.logger.error('Failed to get AI investment suggestions:', error);
        // Continue without AI suggestions
      }

      // Always return the mock options, combine with AI suggestions if available
      const mockOptions = this.getMockInvestmentOptions(surplusCash, riskProfile);
      return [...aiSuggestions, ...mockOptions];
    } catch (error) {
      this.logger.error('Error in getInvestmentOptions:', error);
      // In case of any error, still return mock options
      return this.getMockInvestmentOptions(surplusCash, riskProfile);
    }
  }

  async allocateFunds(input: AllocateFundsInput): Promise<InvestmentResult> {
    try {
      // Look up the investment details based on investmentId
      const investmentOptions = await this.getInvestmentOptions(input.amount, input.riskProfile);
      const selectedInvestment = investmentOptions.find(opt => opt.id === input.investmentId);
      
      if (!selectedInvestment) {
        return {
          success: false,
          message: `Investment with ID ${input.investmentId} not found`,
          investmentId: input.investmentId,
        };
      }
      
      // Save the investment record to the database using raw query
      await this.prisma.$executeRaw`
        INSERT INTO Investment (investmentId, name, type, amount, expectedReturn, risk, date, createdAt, updatedAt)
        VALUES (
          ${input.investmentId}, 
          ${selectedInvestment.name}, 
          ${selectedInvestment.type}, 
          ${input.amount}, 
          ${selectedInvestment.expectedReturn}, 
          ${selectedInvestment.risk},
          datetime('now'),
          datetime('now'),
          datetime('now')
        )
      `;

      // Return success response
      return {
        success: true,
        message: `Successfully allocated €${input.amount.toLocaleString()} to investment ${selectedInvestment.name}`,
        investmentId: input.investmentId,
        transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };
    } catch (error) {
      console.error('Error allocating funds:', error);
      return {
        success: false,
        message: 'Failed to allocate funds. Please try again later.',
        investmentId: input.investmentId,
      };
    }
  }

  private async getEuribor3M(): Promise<number> {
    try {
      this.logger.debug('Fetching Euribor data from ECB...');
      const response = await axios.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
      this.logger.debug('ECB Euribor Response:', response.data);
      const euribor = this.parseEuriborFromXML(response.data);
      return euribor;
    } catch (error) {
      this.logger.error('Error fetching Euribor data:', error.message);
      return 0.03; // Fallback value
    }
  }

  private async getGermanCPI(): Promise<number> {
    try {
      this.logger.debug('Fetching CPI data from ECB...');
      const response = await axios.get('https://www.ecb.europa.eu/stats/prices/hicp/html/index.en.html');
      this.logger.debug('ECB CPI Response:', response.data);
      const cpi = this.parseCPIFromHTML(response.data);
      return cpi;
    } catch (error) {
      this.logger.error('Error fetching CPI data:', error.message);
      return 0.025; // Fallback value
    }
  }

  private async getMarketIndicators() {
    try {
      this.logger.debug('Fetching market indicators from Alpha Vantage...');
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^GDAXI&apikey=${this.alphaVantageApiKey}`
      );
      this.logger.debug('Alpha Vantage Response:', response.data);
      const data = response.data['Global Quote'];
      return {
        forecastedYield: this.calculateForecastedYield(data),
        marketTrend: this.analyzeMarketTrend(data),
      };
    } catch (error) {
      this.logger.error('Error fetching market indicators:', error.message);
      return {
        forecastedYield: 0.068,
        marketTrend: 'stable',
      };
    }
  }

  private async getRealTimeMarketData() {
    try {
      this.logger.debug('Fetching real-time market data from Finnhub...');
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${this.finnhubApiKey}`
      );
      this.logger.debug('Finnhub Response:', response.data);
      return response.data.map(stock => ({
        symbol: stock.symbol,
        price: stock.price,
        historicalPerformance: stock.historicalPerformance,
      }));
    } catch (error) {
      this.logger.error('Error fetching real-time market data:', error.message);
      return [];
    }
  }

  private async calculateCAGR(): Promise<number> {
    try {
      this.logger.debug('Fetching historical data from Alpha Vantage for CAGR calculation...');
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=^GDAXI&apikey=${this.alphaVantageApiKey}`
      );
      this.logger.debug('Alpha Vantage Historical Data:', response.data);
      const data = response.data['Monthly Time Series'];
      const values = Object.values(data).slice(0, 12);
      const startPrice = parseFloat(values[values.length - 1]['4. close']);
      const endPrice = parseFloat(values[0]['4. close']);
      return Math.pow(endPrice / startPrice, 1 / (values.length / 12)) - 1;
    } catch (error) {
      this.logger.error('Error calculating CAGR:', error.message);
      return 0.092; // Fallback value
    }
  }

  private calculateExpectedReturn(suggestion: any, marketInfo: any): string {
    if (!marketInfo) return suggestion.expectedReturn;
    
    const baseReturn = parseFloat(suggestion.expectedReturn.replace('%', '')) / 100;
    const marketAdjustment = marketInfo.historicalPerformance || 0;
    const adjustedReturn = (baseReturn + marketAdjustment) * 100;
    
    return `${adjustedReturn.toFixed(1)}% annually`;
  }

  private calculateRiskLevel(suggestion: any, marketInfo: any): string {
    if (!marketInfo) return suggestion.risk;
    
    const volatility = marketInfo.historicalVolatility || 0;
    if (volatility > 0.3) return 'High';
    if (volatility > 0.15) return 'Medium-High';
    if (volatility > 0.1) return 'Medium';
    return 'Low';
  }

  private getMockInvestmentOptions(surplusCash: number, riskProfile: string): InvestmentOption[] {
    // Ensure we always have at least a few fallback options
    const fallbackOptions = [
        {
            id: `inv-fallback-1`,
            name: 'Stable Income REIT',
            type: 'REIT',
            expectedReturn: '6-8% annually',
            risk: 'Medium',
            minimumInvestment: '€2,000',
            description: 'A diversified REIT focused on stable income-producing properties across Europe.',
        },
        {
            id: `inv-fallback-2`,
            name: 'European Corporate Bond Fund',
            type: 'Bond Fund',
            expectedReturn: '4-6% annually',
            risk: 'Low-Medium',
            minimumInvestment: '€1,000',
            description: 'Investment grade corporate bonds providing reliable income with moderate risk.',
        },
        {
            id: `inv-fallback-3`,
            name: 'Growth Equity Portfolio',
            type: 'Equity Fund',
            expectedReturn: '9-12% annually',
            risk: 'High',
            minimumInvestment: '€3,000',
            description: 'Focused on growth equities with potential for significant capital appreciation.',
        }
    ];

    // Base set of investment options
    const baseOptions = [
        {
            id: `inv-${Date.now()}-1`,
            name: 'European REITs Index Fund',
            type: 'ETF',
            expectedReturn: '7-9% annually',
            risk: 'Medium',
            minimumInvestment: '€5,000',
            description: 'Diversified exposure to European real estate investment trusts with focus on commercial properties.',
        },
        {
            id: `inv-${Date.now()}-2`,
            name: 'Real Estate Debt Fund',
            type: 'Fund',
            expectedReturn: '5-6% annually',
            risk: 'Low-Medium',
            minimumInvestment: '€10,000',
            description: 'Invests in secured real estate debt with priority claim over equity investors.',
        },
        {
            id: `inv-${Date.now()}-3`,
            name: 'Property Development Partnership',
            type: 'Direct Investment',
            expectedReturn: '10-15% annually',
            risk: 'High',
            minimumInvestment: '€25,000',
            description: 'Direct partnership in residential development projects in growing urban centers.',
        }
    ];

    // Conservative options
    const conservativeOptions = [
        {
            id: `inv-${Date.now()}-4`,
            name: 'Government Bond ETF',
            type: 'Bond ETF',
            expectedReturn: '3-4% annually',
            risk: 'Low',
            minimumInvestment: '€1,000',
            description: 'Safe investment in government bonds with stable, predictable returns.',
        },
        {
            id: `inv-${Date.now()}-5`,
            name: 'Corporate Bond Fund',
            type: 'Bond Fund',
            expectedReturn: '4-5% annually',
            risk: 'Low',
            minimumInvestment: '€2,500',
            description: 'Investment grade corporate bonds providing slightly higher yield than government securities.',
        },
        {
            id: `inv-${Date.now()}-6`,
            name: 'Residential Rental REIT',
            type: 'REIT',
            expectedReturn: '5-7% annually',
            risk: 'Low-Medium',
            minimumInvestment: '€5,000',
            description: 'Focus on stable residential properties with high occupancy rates and reliable rental income.',
        }
    ];

    // Moderate options
    const moderateOptions = [
        {
            id: `inv-${Date.now()}-7`,
            name: 'Balanced Growth Fund',
            type: 'Mixed Fund',
            expectedReturn: '6-8% annually',
            risk: 'Medium',
            minimumInvestment: '€5,000',
            description: 'Balanced portfolio of bonds, stocks and real estate investments with moderate growth potential.',
        },
        {
            id: `inv-${Date.now()}-8`,
            name: 'Commercial Property REIT',
            type: 'REIT',
            expectedReturn: '7-9% annually',
            risk: 'Medium',
            minimumInvestment: '€7,500',
            description: 'Focus on prime commercial properties in major European cities with strong rental yields.',
        },
        {
            id: `inv-${Date.now()}-9`,
            name: 'European Dividend Stock ETF',
            type: 'Equity ETF',
            expectedReturn: '6-9% annually',
            risk: 'Medium',
            minimumInvestment: '€3,000',
            description: 'Diversified portfolio of European stocks with consistent dividend payments.',
        }
    ];

    // Aggressive options
    const aggressiveOptions = [
        {
            id: `inv-${Date.now()}-10`,
            name: 'Growth Stock ETF',
            type: 'Equity ETF',
            expectedReturn: '10-14% annually',
            risk: 'High',
            minimumInvestment: '€5,000',
            description: 'Focus on high-growth companies with strong earnings potential.',
        },
        {
            id: `inv-${Date.now()}-11`,
            name: 'Property Development Fund',
            type: 'Real Estate Fund',
            expectedReturn: '12-18% annually',
            risk: 'High',
            minimumInvestment: '€15,000',
            description: 'Invest in property development projects with significant capital appreciation potential.',
        },
        {
            id: `inv-${Date.now()}-12`,
            name: 'Tech Innovation Fund',
            type: 'Sector Fund',
            expectedReturn: '15-20% annually',
            risk: 'Very High',
            minimumInvestment: '€10,000',
            description: 'Focus on disruptive technologies and innovative companies with exponential growth potential.',
        }
    ];

    // Make sure we return a non-empty array based on the risk profile
    let result = [];
    switch(riskProfile.toLowerCase()) {
        case 'conservative':
            result = [...conservativeOptions, baseOptions[1]];
            break;
        case 'aggressive':
            result = [...aggressiveOptions, baseOptions[2]];
            break;
        case 'moderate':
        default:
            result = [...moderateOptions, baseOptions[0]];
            break;
    }

    // Final safety check - if somehow we still have no options, return all fallback options
    return result.length > 0 ? result : fallbackOptions;
  }

  private parseEuriborFromXML(xml: string): number {
    // Implement XML parsing logic
    return 0.0325; // Mock value for now
  }

  private parseCPIFromHTML(html: string): number {
    // Implement HTML parsing logic
    return 0.0246; // Mock value for now
  }

  private calculateForecastedYield(data: any): number {
    // Implement yield calculation based on market data
    return 0.068; // Mock value for now
  }

  private analyzeMarketTrend(data: any): string {
    // Implement market trend analysis
    return 'stable'; // Mock value for now
  }

  // Add new method to fetch user investments
  async getUserInvestments() {
    try {
      const investments = await this.prisma.$queryRaw`
        SELECT * FROM Investment ORDER BY date DESC
      `;
      
      const totalInvested = Array.isArray(investments) 
        ? investments.reduce((total, inv: any) => total + inv.amount, 0)
        : 0;
      
      return {
        investments: Array.isArray(investments) ? investments : [],
        totalInvested,
      };
    } catch (error) {
      console.error('Error fetching user investments:', error);
      return {
        investments: [],
        totalInvested: 0,
      };
    }
  }
} 