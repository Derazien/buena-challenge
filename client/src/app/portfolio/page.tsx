'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { motion } from 'framer-motion';
import ScrollRevealCard from '@/components/portfolio/ScrollRevealCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Dynamically import components that use browser APIs to avoid hydration errors
const RentGauge3D = dynamic(() => import('@/components/portfolio/RentGauge3D'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-muted/30 rounded-md flex items-center justify-center">Loading 3D visualization...</div>
});

const ParallaxBalanceTicker = dynamic(() => import('@/components/portfolio/ParallaxBalanceTicker'), {
  ssr: false,
  loading: () => <div className="h-[180px] bg-muted/30 rounded-md flex items-center justify-center">Loading ticker...</div>
});

// Mock data for portfolio summary
const PORTFOLIO_SUMMARY = {
  monthlyRentIn: 15750,
  targetMonthlyRent: 18000,
  allocatedReservePercentage: 15,
  forecastedYield: 7.8,
  availableToReinvest: 10975,
  reserveBalance: 24845,
  monthlyGrowth: 2.3,
  allocationBreakdown: [
    { category: 'Bonds', percentage: 25, amount: 6211.25 },
    { category: 'REITs', percentage: 35, amount: 8695.75 },
    { category: 'Stocks', percentage: 30, amount: 7453.50 },
    { category: 'Cash', percentage: 10, amount: 2484.50 }
  ],
  monthlyPerformance: [
    { month: 'Jan', income: 14200 },
    { month: 'Feb', income: 14500 },
    { month: 'Mar', income: 14800 },
    { month: 'Apr', income: 15100 },
    { month: 'May', income: 15400 },
    { month: 'Jun', income: 15750 }
  ]
};

export default function PortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState(PORTFOLIO_SUMMARY);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Simulated API call to get portfolio data
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPortfolioData(PORTFOLIO_SUMMARY);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Confetti effect when user clicks "Optimize Portfolio"
  useEffect(() => {
    if (showConfetti) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          setShowConfetti(false);
        }, 2000);
      });
    }
  }, [showConfetti]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner text="Loading your portfolio data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Re-Investment Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Analyze your rental income and optimize reinvestment opportunities</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/investments')}
          >
            View Investments
          </Button>
          <Button
            onClick={() => setShowConfetti(true)}
          >
            Optimize Portfolio
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards Row - Animated on Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScrollRevealCard delay={0.1} direction="up">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Monthly Rent-In</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">€{portfolioData.monthlyRentIn.toLocaleString()}</span>
              <span className="ml-2 text-sm text-green-600">+{portfolioData.monthlyGrowth}%</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(portfolioData.monthlyRentIn / portfolioData.targetMonthlyRent) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Target: €{portfolioData.targetMonthlyRent.toLocaleString()}</p>
            </div>
          </Card>
        </ScrollRevealCard>

        <ScrollRevealCard delay={0.2} direction="up">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Allocated % to Reserve</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{portfolioData.allocatedReservePercentage}%</span>
              <span className="ml-2 text-sm text-gray-500">of monthly income</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Reserve Balance</span>
                <span className="font-medium">€{portfolioData.reserveBalance.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">6.5 months of expenses covered</p>
            </div>
          </Card>
        </ScrollRevealCard>

        <ScrollRevealCard delay={0.3} direction="up">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Forecasted Yield</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{portfolioData.forecastedYield}%</span>
              <span className="ml-2 text-sm text-green-600">+2.3% YoY</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Available to Reinvest</span>
                <span className="font-medium">€{portfolioData.availableToReinvest.toLocaleString()}</span>
              </div>
              <Link href="/investments">
                <Button className="w-full mt-2" size="sm">Reinvest Now</Button>
              </Link>
            </div>
          </Card>
        </ScrollRevealCard>
      </div>

      {/* 3D Visualization and Parallax Ticker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ScrollRevealCard direction="left">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Rental Income Collection</h3>
              <div className="h-[400px]">
                <RentGauge3D
                  monthlyRent={portfolioData.monthlyRentIn}
                  targetAmount={portfolioData.targetMonthlyRent}
                />
              </div>
            </Card>
          </ScrollRevealCard>
        </div>

        <div className="space-y-4">
          <ScrollRevealCard direction="right" delay={0.2}>
            <ParallaxBalanceTicker
              balance={portfolioData.reserveBalance}
              label="Reserve Balance"
              backgroundImage="/images/city-skyline.jpg"
            />
          </ScrollRevealCard>

          <ScrollRevealCard direction="right" delay={0.3}>
            <ParallaxBalanceTicker
              balance={portfolioData.availableToReinvest}
              label="Available to Reinvest"
              backgroundImage="/images/investment-bg.jpg"
            />
          </ScrollRevealCard>
        </div>
      </div>

      {/* Revolut-style Stacked Cards */}
      <div className="relative mt-16">
        <h2 className="text-2xl font-bold mb-6">Allocation Breakdown</h2>

        <div className="relative min-h-[400px]">
          {portfolioData.allocationBreakdown.map((allocation, index) => (
            <div
              key={allocation.category}
              className="absolute shadow-xl max-w-lg transform transition-all duration-500"
              style={{
                top: `${index * 40}px`,
                left: `${index * 20}px`,
                zIndex: portfolioData.allocationBreakdown.length - index,
                transform: `rotate(${index * 2 - 3}deg)`
              }}
            >
              <ScrollRevealCard delay={0.1 * index}>
                <Card className="p-6 bg-white dark:bg-gray-800 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1" style={{
                    backgroundColor:
                      allocation.category === 'Bonds' ? '#3b82f6' :
                        allocation.category === 'REITs' ? '#10b981' :
                          allocation.category === 'Stocks' ? '#ef4444' : '#f59e0b'
                  }}></div>
                  <h3 className="text-lg font-medium mb-2">{allocation.category}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-3xl font-bold">{allocation.percentage}%</div>
                    <div className="text-xl font-semibold">€{allocation.amount?.toLocaleString() || '0'}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${allocation.percentage}%`,
                        backgroundColor:
                          allocation.category === 'Bonds' ? '#3b82f6' :
                            allocation.category === 'REITs' ? '#10b981' :
                              allocation.category === 'Stocks' ? '#ef4444' : '#f59e0b'
                      }}
                    ></div>
                  </div>
                </Card>
              </ScrollRevealCard>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to Optimize Your Portfolio?</h2>
            <p className="opacity-90">Our AI-powered recommendation engine can help you maximize returns.</p>
          </div>
          <Button
            variant="secondary"
            className="whitespace-nowrap"
            onClick={() => {
              setShowConfetti(true);
              setTimeout(() => router.push('/investments'), 500);
            }}
          >
            Get Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}