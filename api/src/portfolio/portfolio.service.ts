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

    return {
      monthlyRentIn: monthlyRent,
      allocatedReservePercentage: 0.25, // 25% allocated to reserve
      forecastedYield: marketIndicators.forecastedYield,
      euribor3M: euribor,
      germanCPI: cpi,
      cagrProjection,
      threeYearProjection,
    };
  }

  async getInvestmentOptions(surplusCash: number, riskProfile: string): Promise<InvestmentOption[]> {
    // Get real-time market data
    const [euribor, cpi, marketIndicators] = await Promise.all([
      this.getEuribor3M(),
      this.getGermanCPI(),
      this.getMarketIndicators(),
    ]);

    // Get AI suggestions with market data
    const aiSuggestions = await this.llamaService.suggestInvestment(
      surplusCash,
      riskProfile,
      {
        euribor,
        cpi,
        marketIndicators
      }
    );

    // Combine AI suggestions with mock data for now
    return [...aiSuggestions, ...this.getMockInvestmentOptions(surplusCash, riskProfile)];
  }

  async allocateFunds(input: AllocateFundsInput): Promise<InvestmentResult> {
    try {
      // Initialize Plaid client
      const plaid = require('plaid');
      const plaidClient = new plaid.Client({
        clientID: this.plaidClientId,
        secret: this.plaidSecret,
        env: plaid.environments[this.plaidEnv],
      });

      // Execute the investment
      const result = await plaidClient.investments.transactions.create({
        investment_id: input.investmentId,
        amount: input.amount,
        currency: 'EUR',
      });

      return {
        success: true,
        message: `Successfully allocated €${input.amount.toLocaleString()} to investment ${input.investmentId}`,
        investmentId: input.investmentId,
        transactionId: result.transaction_id,
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
    return [
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
      },
    ];
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
} 