import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class MonthlyIncome {
    @Field()
    month: string;

    @Field(() => Float)
    income: number;

    @Field(() => Float)
    expenses: number;

    @Field(() => Float)
    net: number;
}

@ObjectType()
export class MonthlyIncomeStats {
    @Field(() => Float)
    currentIncome: number;

    @Field(() => Float)
    currentExpenses: number;

    @Field(() => Float)
    currentNet: number;

    @Field(() => Float)
    monthlyChange: number;

    @Field(() => [MonthlyIncome])
    monthlyData: MonthlyIncome[];
}