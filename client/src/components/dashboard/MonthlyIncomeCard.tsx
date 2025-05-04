'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AnimatedCard from '@/components/common/AnimatedCard';
import AnimatedText from '@/components/common/AnimatedText';

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
    <AnimatedCard className="p-5" hoverEffect="lift" delay={0.1} once={false}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground">
          <AnimatedText
            text="Monthly Income"
            animation="slide-up"
            type="word"
            once={false}
          />
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 text-xs rounded-md ${selectedPeriod === 'month'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-3 py-1 text-xs rounded-md ${selectedPeriod === 'year'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end space-x-2">
          <AnimatedText
            text={`$${monthlyIncome.current}`}
            className="text-2xl font-bold text-foreground"
            animation="bounce"
            delay={0.2}
            once={false}
          />
          <div className={`text-xs px-1.5 py-0.5 rounded-full ${monthlyIncome.percentageChange >= 0
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-destructive/15 text-destructive'}`}>
            {monthlyIncome.percentageChange >= 0 ? '+' : ''}{monthlyIncome.percentageChange}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Compared to ${monthlyIncome.previous} last period</p>
      </div>

      {/* Simple bar chart with animations */}
      <div className="h-32 mt-4 flex items-end space-x-1">
        {monthlyData.map((item, index) => {
          const maxValue = Math.max(...monthlyData.map(d => d.value));
          const height = `${(item.value / maxValue) * 100}%`;
          const isLatest = index === monthlyData.length - 1;

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t-sm ${isLatest ? 'bg-primary' : 'bg-primary/40'}`}
                style={{
                  height,
                  transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: `${index * 0.1}s`
                }}
              />
              <span className="text-xs mt-1 text-muted-foreground">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <Button className="w-full">Manage Income</Button>
      </div>
    </AnimatedCard>
  );
};

export default MonthlyIncomeCard;