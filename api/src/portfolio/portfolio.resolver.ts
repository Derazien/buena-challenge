import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PortfolioService } from './portfolio.service';
import { PortfolioSummary } from './models/portfolio-summary.model';
import { InvestmentOption } from './models/investment-option.model';
import { AllocateFundsInput } from './dto/allocate-funds.input';
import { InvestmentResult } from './models/investment-result.model';

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
} 