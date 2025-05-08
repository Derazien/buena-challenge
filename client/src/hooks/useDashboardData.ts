import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS, GET_MANUAL_REVIEW_TICKETS } from '@/graphql/queries';
import { differenceInMonths, parseISO } from 'date-fns';
import {
    DashboardStats,
    MonthlyIncome,
    OpenTicket,
    UpcomingRenewal,
    MonthlyDataItem
} from '@/types/api/dashboard.types';

export function useDashboardStats() {
    const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_STATS);

    const dashboardData: DashboardStats = data?.dashboardStats || {
        totalProperties: 0,
        monthlyIncome: {
            currentIncome: 0,
            currentExpenses: 0,
            currentNet: 0,
            monthlyChange: 0,
            monthlyData: []
        },
        ticketStats: {
            openTickets: [],
            totalCount: 0
        },
        leaseStats: {
            upcomingRenewals: [],
            totalCount: 0
        }
    };

    return {
        loading,
        error,
        dashboardData,
        totalProperties: dashboardData.totalProperties,
        monthlyIncome: dashboardData.monthlyIncome,
        ticketStats: dashboardData.ticketStats,
        leaseStats: dashboardData.leaseStats,
        refetch
    };
}

export function useMonthlyIncome() {
    const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);

    const monthlyIncome: MonthlyIncome = data?.dashboardStats?.monthlyIncome || {
        currentIncome: 0,
        currentExpenses: 0,
        currentNet: 0,
        monthlyChange: 0,
        monthlyData: []
    };

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
    const { loading, error, data } = useQuery(GET_MANUAL_REVIEW_TICKETS, {
        fetchPolicy: 'network-only'
    });

    return {
        loading,
        error,
        openTickets: data?.tickets || [],
        ticketCount: data?.tickets?.length || 0
    };
}

export function useUpcomingLeases() {
    const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);

    const leaseStats = data?.dashboardStats?.leaseStats || {
        upcomingRenewals: [],
        totalCount: 0
    };
    const today = new Date();

    return {
        loading,
        error,
        upcomingRenewals: leaseStats.upcomingRenewals as UpcomingRenewal[] || [],
        renewalCount: leaseStats.totalCount || 0,
        getMonthsUntilRenewal: (endDate: string) => {
            return differenceInMonths(parseISO(endDate), today);
        }
    };
}