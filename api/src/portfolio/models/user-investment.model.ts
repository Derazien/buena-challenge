import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class UserInvestment {
  @Field(() => Int)
  id: number;

  @Field()
  investmentId: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field(() => Float)
  amount: number;

  @Field()
  expectedReturn: string;

  @Field()
  risk: string;

  @Field()
  date: Date;
}

@ObjectType()
export class UserInvestmentsResponse {
  @Field(() => [UserInvestment])
  investments: UserInvestment[];

  @Field(() => Float)
  totalInvested: number;
} 