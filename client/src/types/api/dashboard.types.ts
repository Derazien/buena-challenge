export interface MonthlyDataItem {
    month: string;
    income: number;
    expenses: number;
    net: number;
}

export interface MonthlyIncome {
    currentIncome: number;
    currentExpenses: number;
    currentNet: number;
    monthlyChange: number;
    monthlyData: MonthlyDataItem[];
}

export interface OpenTicket {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    propertyId: number;
    propertyAddress: string;
    createdAt: string;
}

export interface TicketStats {
    openTickets: OpenTicket[];
    totalCount: number;
}

export interface UpcomingRenewal {
    id: number;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    tenantName: string;
    isActive: boolean;
    propertyId: number;
    propertyAddress: string;
}

export interface LeaseStats {
    upcomingRenewals: UpcomingRenewal[];
    totalCount: number;
}

export interface DashboardStats {
    totalProperties: number;
    monthlyIncome: MonthlyIncome;
    ticketStats: TicketStats;
    leaseStats: LeaseStats;
}