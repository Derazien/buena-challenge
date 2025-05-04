import { ObjectType, Field, Float } from '@nestjs/graphql';
import { YearlyProjection } from './yearly-projection.model';

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
} 