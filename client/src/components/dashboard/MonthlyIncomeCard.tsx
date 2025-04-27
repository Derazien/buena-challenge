'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon } from '@/components/icons/Arrows';
import { useMonthlyIncome } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/Skeleton';

interface MonthlyDataItem {
    month: string;
    income: number;
    expenses: number;
    net: number;
}

const MonthlyIncomeCard = () => {
    const { loading, error, monthlyData, currentMonthIncome, currentMonthExpenses, currentMonthNet, monthlyChange } = useMonthlyIncome();

    if (loading) {
        return (
            <Card borderColor="success">
                <div className="flex flex-col space-y-4">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-16 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card borderColor="danger">
                <div className="text-red-500">Error loading monthly income data</div>
            </Card>
        );
    }

    return (
        <Card borderColor="success">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Monthly Income</h2>
                <span className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${monthlyChange >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {monthlyChange >= 0 ? (
                        <ArrowUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                        <ArrowDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(monthlyChange).toFixed(1)}% from last month
                </span>
            </div>

            <div className="text-3xl font-bold text-green-600">${currentMonthNet.toLocaleString()}</div>
            <div className="mt-1 text-gray-500 text-sm">After expenses</div>

            {/* Simplified mini graph */}
            <div className="mt-3 h-16 relative">
                <div className="absolute inset-0 flex items-end justify-between">
                    {monthlyData.map((month: MonthlyDataItem, i: number) => {
                        const height = (month.net / Math.max(...monthlyData.map((m: MonthlyDataItem) => m.net))) * 100;
                        return (
                            <div key={i} className="w-1/6 flex flex-col items-center group">
                                <div
                                    className={`w-2 rounded-t-sm ${i === monthlyData.length - 1 ? 'bg-green-500' : 'bg-blue-300'}`}
                                    style={{ height: `${height}%` }}
                                ></div>
                                <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {month.month}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200/20">
                    <div className="text-sm text-gray-500">Income</div>
                    <div className="font-medium text-gray-800">${currentMonthIncome.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200/20">
                    <div className="text-sm text-gray-500">Expenses</div>
                    <div className="font-medium text-gray-800">${currentMonthExpenses.toLocaleString()}</div>
                </div>
            </div>

            <div className="mt-6">
                <Link href="/reinvest">
                    <Button className="w-full">
                        Reinvest Surplus
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

export default MonthlyIncomeCard;