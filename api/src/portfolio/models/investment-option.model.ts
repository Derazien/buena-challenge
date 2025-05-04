import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class InvestmentOption {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  expectedReturn: string;

  @Field()
  risk: string;

  @Field()
  minimumInvestment: string;

  @Field()
  description: string;
} 