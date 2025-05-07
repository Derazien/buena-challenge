'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { useUpcomingLeases } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/Skeleton';

interface Lease {
    id: number;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    tenantName: string;
    isActive: boolean;
    propertyId: number;
    propertyAddress: string;
}

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const LeaseExpiryCard = () => {
    const { loading, error, upcomingRenewals, renewalCount } = useUpcomingLeases();

    if (loading) {
        return (
            <Card borderColor="primary">
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-10" />
                    </div>
                    <Skeleton className="h-10 w-12" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card borderColor="danger">
                <div className="text-red-500">Error loading lease data</div>
            </Card>
        );
    }

    return (
        <Card borderColor="primary">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Lease Expiries</h2>
                <Badge variant="warning">{renewalCount}</Badge>
            </div>

            <div className="text-3xl font-bold text-blue-500">{renewalCount}</div>
            <div className="mt-1 text-gray-500 text-sm">Expiring within 90 days</div>

            <div className="mt-6 space-y-3">
                {upcomingRenewals.length > 0 ? (
                    upcomingRenewals.slice(0, 2).map((lease: Lease) => (
                        <div key={lease.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between">
                                <div className="font-medium text-gray-800">
                                    {lease.propertyAddress}
                                </div>
                                <div className="text-sm text-blue-600 flex items-center">
                                    <CalendarIcon />
                                    {formatDistanceToNow(new Date(lease.endDate), { addSuffix: true })}
                                </div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <div className="text-sm text-gray-500">
                                    {lease.tenantName}
                                </div>
                                <Badge variant="warning" className="text-xs">
                                    Renew soon
                                </Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        No lease expiries soon
                    </div>
                )}

                {upcomingRenewals.length > 2 && (
                    <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 rounded-md">
                        +{upcomingRenewals.length - 2} more expiries
                    </div>
                )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                    View All
                </Button>
                <Button className="w-full">
                    Renew Lease
                </Button>
            </div>
        </Card>
    );
};

export default LeaseExpiryCard;