import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class AllocateFundsInput {
  @Field(() => Float)
  amount: number;

  @Field()
  investmentId: string;

  @Field()
  riskProfile: string;
} 