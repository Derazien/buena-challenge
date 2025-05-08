import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PortfolioService } from './portfolio.service';
import { PortfolioSummary } from './models/portfolio-summary.model';
import { InvestmentOption } from './models/investment-option.model';
import { AllocateFundsInput } from './dto/allocate-funds.input';
import { InvestmentResult } from './models/investment-result.model';
import { HistoricalReturn } from './models/historical-return.model';
import { UserInvestmentsResponse } from './models/user-investment.model';

@Resolver()
export class PortfolioResolver {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Query(() => PortfolioSummary)
  async portfolioSummary() {
    return this.portfolioService.getPortfolioSummary();
  }

  @Query(() => [InvestmentOption])
  async investmentOptions(
    @Args('surplusCash') surplusCash: number,
    @Args('riskProfile') riskProfile: string,
  ) {
    return this.portfolioService.getInvestmentOptions(surplusCash, riskProfile);
  }

  @Mutation(() => InvestmentResult)
  async allocateFunds(
    @Args('input') input: AllocateFundsInput,
  ) {
    return this.portfolioService.allocateFunds(input);
  }

  @Query(() => [HistoricalReturn])
  async historicalReturns() {
    // Return mock data for now
    return [
      { date: '2023-01-01', value: 5.2 },
      { date: '2023-02-01', value: 5.5 },
      { date: '2023-03-01', value: 5.7 },
    ];
  }

  @Query(() => UserInvestmentsResponse)
  async userInvestments() {
    return this.portfolioService.getUserInvestments();
  }
} 