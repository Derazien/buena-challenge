'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AnimatedCard from '@/components/common/AnimatedCard';
import AnimatedText from '@/components/common/AnimatedText';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '@/graphql/queries';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const MonthlyIncomeCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error.message} />;
  }

  const monthlyIncome = data?.dashboardStats?.monthlyIncome;
  const monthlyData = monthlyIncome?.monthlyData || [];

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Income</h2>
          <div className="flex space-x-2">
            <Button
              className={`px-3 py-1 text-xs rounded-md ${selectedPeriod === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
                }`}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </Button>
            <Button
              className={`px-3 py-1 text-xs rounded-md ${selectedPeriod === 'year'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
                }`}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Month</p>
            <AnimatedText
              text={`€${monthlyIncome?.currentIncome || 0}`}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Change</p>
              <p className={`text-lg font-semibold ${monthlyIncome?.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyIncome?.monthlyChange >= 0 ? '+' : ''}{monthlyIncome?.monthlyChange.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Income</p>
              <AnimatedText
                text={`€${monthlyIncome?.currentNet || 0}`}
                className="text-lg font-semibold text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="h-48">
            {/* Add a chart component here to visualize the monthlyData */}
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart visualization coming soon
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default MonthlyIncomeCard;