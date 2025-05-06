import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class InvestmentResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  investmentId?: string;

  @Field({ nullable: true })
  transactionId?: string;
} 