import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { YearlyProjection } from './yearly-projection.model';

@ObjectType()
class PropertySummary {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field(() => Float)
  monthlyRent: number;

  @Field(() => Float)
  occupancyRate: number;
}

@ObjectType()
class AllocationBreakdown {
  @Field()
  category: string;

  @Field(() => Float)
  percentage: number;

  @Field(() => Float)
  amount: number;
}

@ObjectType()
class MonthlyPerformance {
  @Field()
  month: string;

  @Field(() => Float)
  income: number;
}

@ObjectType()
export class PortfolioSummary {
  @Field(() => Float)
  monthlyRentIn: number;

  @Field(() => Float)
  allocatedReservePercentage: number;

  @Field(() => Float)
  forecastedYield: number;

  @Field(() => Float)
  euribor3M: number;

  @Field(() => Float)
  germanCPI: number;

  @Field(() => Float)
  cagrProjection: number;

  @Field(() => [YearlyProjection])
  threeYearProjection: YearlyProjection[];

  // New fields to match frontend expectations
  @Field(() => Float)
  availableToInvest: number;

  @Field(() => Float)
  availableToReinvest: number;

  @Field(() => Float)
  reserveBalance: number;

  @Field(() => Float)
  monthlyGrowth: number;

  @Field(() => Float)
  targetMonthlyRent: number;

  @Field(() => [PropertySummary])
  properties: PropertySummary[];

  @Field(() => [AllocationBreakdown])
  allocationBreakdown: AllocationBreakdown[];

  @Field(() => [MonthlyPerformance])
  monthlyPerformance: MonthlyPerformance[];
} 