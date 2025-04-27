import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '@/graphql/queries';
import { differenceInMonths, parseISO } from 'date-fns';

export function useDashboardStats() {
    const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_STATS);

    return {
        loading,
        error,
        dashboardData: data?.dashboardStats || null,
        totalProperties: data?.dashboardStats?.totalProperties || 0,
        monthlyIncome: data?.dashboardStats?.monthlyIncome || {},
        ticketStats: data?.dashboardStats?.ticketStats || {},
        leaseStats: data?.dashboardStats?.leaseStats || {},
        refetch
    };
}

export function useMonthlyIncome() {
    const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);

    const monthlyIncome = data?.dashboardStats?.monthlyIncome || {};

    return {
        loading,
        error,
        monthlyData: monthlyIncome.monthlyData || [],
        currentMonthIncome: monthlyIncome.currentIncome || 0,
        currentMonthExpenses: monthlyIncome.currentExpenses || 0,
        currentMonthNet: monthlyIncome.currentNet || 0,
        monthlyChange: monthlyIncome.monthlyChange || 0
    };
}

export function useOpenTickets() {
    const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);

    const ticketStats = data?.dashboardStats?.ticketStats || {};

    return {
        loading,
        error,
        openTickets: ticketStats.openTickets || [],
        ticketCount: ticketStats.totalCount || 0
    };
}

export function useUpcomingLeases() {
    const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);

    const leaseStats = data?.dashboardStats?.leaseStats || {};
    const today = new Date();

    return {
        loading,
        error,
        upcomingRenewals: leaseStats.upcomingRenewals || [],
        renewalCount: leaseStats.totalCount || 0,
        getMonthsUntilRenewal: (endDate: string) => {
            return differenceInMonths(parseISO(endDate), today);
        }
    };
}