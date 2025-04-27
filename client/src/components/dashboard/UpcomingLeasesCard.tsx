'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useUpcomingLeases } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/Skeleton';
import { parseISO, format } from 'date-fns';
import { Lease } from '@/hooks/useProperties';

interface ExtendedLease extends Lease {
    propertyAddress: string;
    propertyId: number;
}

const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
};

const UpcomingLeasesCard = () => {
    const { loading, error, upcomingRenewals, renewalCount, getMonthsUntilRenewal } = useUpcomingLeases();

    if (loading) {
        return (
            <Card borderColor="info">
                <div className="flex flex-col space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-12" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card borderColor="danger">
                <div className="text-buena-danger">Error loading lease data</div>
            </Card>
        );
    }

    const getProgressColor = (months: number) => {
        if (months <= 1) return 'bg-buena-danger';
        if (months <= 3) return 'bg-buena-warning';
        return 'bg-buena-info';
    };

    return (
        <Card borderColor="info">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-buena-dark">Lease Renewals</h2>
            </div>

            <div className="text-3xl font-bold text-buena-info">{renewalCount}</div>
            <div className="mt-1 text-buena-muted text-sm">Within the next 12 months</div>

            <div className="mt-6 space-y-3">
                {upcomingRenewals.length > 0 ? (
                    upcomingRenewals.slice(0, 2).map((lease: ExtendedLease) => {
                        const months = getMonthsUntilRenewal(lease.endDate);
                        const progressColor = getProgressColor(months);
                        const progressWidth = Math.min(100, Math.max(5, (months / 12) * 100));

                        return (
                            <div key={lease.id} className="p-4 rounded-lg border border-buena-border bg-gradient-to-r from-white to-buena-light/30 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between">
                                    <div className="font-medium text-buena-dark">{lease.propertyAddress}</div>
                                    <div className="text-sm text-buena-info font-medium">
                                        {formatDate(lease.endDate)}
                                    </div>
                                </div>
                                <div className="text-sm text-buena-muted mt-2">
                                    {lease.tenantName} • ${lease.monthlyRent.toLocaleString()}/mo
                                </div>
                                <div className="mt-3 w-full bg-buena-border/30 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${progressColor}`}
                                        style={{ width: `${progressWidth}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-buena-muted mt-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {months} {months === 1 ? 'month' : 'months'} until renewal
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center p-6 text-buena-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-buena-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No upcoming lease renewals
                    </div>
                )}

                {upcomingRenewals.length > 2 && (
                    <div className="text-center text-sm text-buena-muted py-2 bg-buena-light/50 rounded-md">
                        +{upcomingRenewals.length - 2} more renewals
                    </div>
                )}
            </div>

            <div className="mt-6">
                <Button variant="outline" className="w-full">
                    Manage Leases
                </Button>
            </div>
        </Card>
    );
};

export default UpcomingLeasesCard;