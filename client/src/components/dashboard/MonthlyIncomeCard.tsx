'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const MonthlyIncomeCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample data - in a real app, this would come from an API
  const monthlyIncome = {
    current: 4250,
    previous: 3950,
    percentageChange: 7.59
  };

  // Sample monthly data points
  const monthlyData = [
    { month: 'Jan', value: 3850 },
    { month: 'Feb', value: 3900 },
    { month: 'Mar', value: 3950 },
    { month: 'Apr', value: 4100 },
    { month: 'May', value: 4200 },
    { month: 'Jun', value: 4250 }
  ];

  return (
    <Card className="dark:bg-neutral-800 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium dark:text-white text-neutral-900">Monthly Income</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 text-xs rounded-md ${
              selectedPeriod === 'month'
                ? 'bg-primary text-white'
                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-3 py-1 text-xs rounded-md ${
              selectedPeriod === 'year'
                ? 'bg-primary text-white'
                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end space-x-2">
          <span className="text-2xl font-bold dark:text-white text-neutral-900">${monthlyIncome.current}</span>
          <div className={`text-xs px-1.5 py-0.5 rounded-full ${monthlyIncome.percentageChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
            {monthlyIncome.percentageChange >= 0 ? '+' : ''}{monthlyIncome.percentageChange}%
          </div>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Compared to ${monthlyIncome.previous} last period</p>
      </div>

      {/* Simple bar chart */}
      <div className="h-32 mt-4 flex items-end space-x-1">
        {monthlyData.map((item, index) => {
          const maxValue = Math.max(...monthlyData.map(d => d.value));
          const height = `${(item.value / maxValue) * 100}%`;
          const isLatest = index === monthlyData.length - 1;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full rounded-t-sm ${isLatest ? 'bg-primary' : 'bg-primary/40 dark:bg-primary/30'}`} 
                style={{ height }}
              />
              <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4">
        <Button className="w-full">Manage Income</Button>
      </div>
    </Card>
  );
};

export default MonthlyIncomeCard;