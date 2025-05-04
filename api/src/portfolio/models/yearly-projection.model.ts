import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class YearlyProjection {
  @Field(() => Int)
  year: number;

  @Field(() => Float)
  amount: number;
} 