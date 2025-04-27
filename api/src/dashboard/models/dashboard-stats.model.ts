import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { MonthlyIncomeStats } from './monthly-income.model';
import { TicketStats } from './ticket-stats.model';
import { LeaseStats } from './lease-stats.model';

@ObjectType()
export class DashboardStats {
    @Field(() => Int)
    totalProperties: number;

    @Field(() => MonthlyIncomeStats)
    monthlyIncome: MonthlyIncomeStats;

    @Field(() => TicketStats)
    ticketStats: TicketStats;

    @Field(() => LeaseStats)
    leaseStats: LeaseStats;
}