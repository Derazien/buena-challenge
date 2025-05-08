'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMonthlyIncome } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/Skeleton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Define the theme colors to match our Tailwind theme
const chartColors = {
    income: {
        border: '#10B981', // green-500
        background: 'rgba(16, 185, 129, 0.2)',
    },
    expenses: {
        border: '#EF4444', // red-500
        background: 'rgba(239, 68, 68, 0.2)',
    },
    net: {
        border: '#3B82F6', // blue-500
        background: 'rgba(59, 130, 246, 0.2)',
    }
};

interface MonthlyDataItem {
    month: string;
    income: number;
    expenses: number;
    net: number;
}

const RevenueLineChart = () => {
    const { loading, error, monthlyData } = useMonthlyIncome();

    if (loading) {
        return (
            <div className="bg-white rounded-md p-4 h-80 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-md p-4 h-80 flex items-center justify-center">
                <span className="text-red-500">Error loading revenue data</span>
            </div>
        );
    }

    const data = {
        labels: monthlyData.map((item: MonthlyDataItem) => item.month),
        datasets: [
            {
                label: 'Rental Income',
                data: monthlyData.map((item: MonthlyDataItem) => item.income),
                borderColor: chartColors.income.border,
                backgroundColor: chartColors.income.background,
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: chartColors.income.border,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1,
                pointRadius: 4,
            },
            {
                label: 'Expenses',
                data: monthlyData.map((item: MonthlyDataItem) => item.expenses),
                borderColor: chartColors.expenses.border,
                backgroundColor: chartColors.expenses.background,
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: chartColors.expenses.border,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1,
                pointRadius: 4,
            },
            {
                label: 'Net Income',
                data: monthlyData.map((item: MonthlyDataItem) => item.net),
                borderColor: chartColors.net.border,
                backgroundColor: chartColors.net.background,
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: chartColors.net.border,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1,
                pointRadius: 4,
            }
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)', // gray-200 with opacity
                },
                ticks: {
                    callback: function (value) {
                        return '€' + Number(value).toLocaleString();
                    },
                    color: '#64748B', // gray-500
                }
            },
            x: {
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)', // gray-200 with opacity
                },
                ticks: {
                    color: '#64748B', // gray-500
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                    color: '#1E293B', // gray-800
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1E293B', // gray-800
                bodyColor: '#64748B', // gray-500
                borderColor: 'rgba(226, 232, 240, 0.8)', // gray-200 with opacity
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += '€' + context.parsed.y.toLocaleString();
                        }
                        return label;
                    }
                }
            }
        },
    };

    return (
        <div className="bg-white rounded-md p-4 h-80">
            <Line data={data} options={options} />
        </div>
    );
};

export default RevenueLineChart;