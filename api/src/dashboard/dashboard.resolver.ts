import { Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { DashboardStats } from './models/dashboard-stats.model';
import { MonthlyIncome } from './models/monthly-income.model';
import { TicketStats } from './models/ticket-stats.model';
import { LeaseStats } from './models/lease-stats.model';
import { subMonths, isAfter, format } from 'date-fns';

@Resolver()
export class DashboardResolver {
    constructor(private readonly prisma: PrismaService) { }

    @Query(() => DashboardStats)
    async dashboardStats() {
        // Get all properties with their relations
        const properties = await this.prisma.property.findMany({
            include: {
                cashFlows: true,
                tickets: true,
                leases: true,
            },
        });

        // Calculate income and expenses for the last 6 months
        const today = new Date();
        const sixMonthsAgo = subMonths(today, 6);

        // Filter cash flows by date
        const recentCashFlows = properties.flatMap(property =>
            property.cashFlows.filter(cf => isAfter(new Date(cf.date), sixMonthsAgo))
        );

        // Calculate total income and expenses by month
        const monthlyIncome: MonthlyIncome[] = [];
        for (let i = 5; i >= 0; i--) {
            const monthDate = subMonths(today, i);
            const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

            const monthCashFlows = recentCashFlows.filter(cf => {
                const cfDate = new Date(cf.date);
                return cfDate >= monthStart && cfDate <= monthEnd;
            });

            const income = monthCashFlows
                .filter(cf => cf.type === 'INCOME')
                .reduce((sum, cf) => sum + cf.amount, 0);

            const expenses = monthCashFlows
                .filter(cf => cf.type === 'EXPENSE')
                .reduce((sum, cf) => sum + cf.amount, 0);

            monthlyIncome.push({
                month: format(monthDate, 'MMM'),
                income,
                expenses,
                net: income - expenses,
            });
        }

        // Calculate open tickets
        const openTickets = properties.flatMap(property =>
            property.tickets
                .filter(ticket => ticket.status === 'OPEN')
                .map(ticket => ({
                    id: ticket.id,
                    title: ticket.title,
                    description: ticket.description,
                    priority: ticket.priority,
                    status: ticket.status,
                    propertyId: property.id,
                    propertyAddress: property.address,
                    createdAt: ticket.createdAt.toISOString(),
                }))
        );

        // Calculate upcoming lease renewals
        const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

        const upcomingRenewals = properties.flatMap(property =>
            property.leases
                .filter(lease => {
                    const endDate = new Date(lease.endDate);
                    return endDate <= oneYearFromNow && lease.isActive;
                })
                .map(lease => ({
                    id: lease.id,
                    startDate: lease.startDate.toISOString(),
                    endDate: lease.endDate.toISOString(),
                    monthlyRent: lease.monthlyRent,
                    tenantName: lease.tenantName,
                    isActive: lease.isActive,
                    propertyId: property.id,
                    propertyAddress: property.address,
                }))
        ).sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

        // Get current month's totals
        const currentMonth = monthlyIncome[monthlyIncome.length - 1];

        // Calculate percentage change from previous month
        const previousMonth = monthlyIncome[monthlyIncome.length - 2];
        const monthlyChange = previousMonth && currentMonth
            ? ((currentMonth.net - previousMonth.net) / previousMonth.net) * 100
            : 0;

        return {
            totalProperties: properties.length,
            monthlyIncome: {
                currentIncome: currentMonth.income,
                currentExpenses: currentMonth.expenses,
                currentNet: currentMonth.net,
                monthlyChange,
                monthlyData: monthlyIncome,
            },
            ticketStats: {
                openTickets,
                totalCount: openTickets.length,
            },
            leaseStats: {
                upcomingRenewals,
                totalCount: upcomingRenewals.length,
            },
        };
    }
}