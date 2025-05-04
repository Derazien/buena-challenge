'use client';

import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/client';
import { GET_PORTFOLIO_SUMMARY } from '@/graphql/portfolio.operations';
import Card from '@/components/ui/Card';
import RentGauge3D from '@/components/portfolio/RentGauge3D';
import ScrollRevealCard from '@/components/portfolio/ScrollRevealCard';
import ParallaxBalanceTicker from '@/components/portfolio/ParallaxBalanceTicker';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { motion } from 'framer-motion';

type PortfolioSummary = {
  monthlyRentIn: number;
  allocatedReservePercentage: number;
  forecastedYield: number;
  euribor3M: number;
  germanCPI: number;
  cagrProjection: number;
  threeYearProjection: {
    year: number;
    amount: number;
  }[];
};

export default function PortfolioPage() {
  const [scrollY, setScrollY] = useState(0);
  const [portfolioData, setPortfolioData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock data while we wait for the backend
  useEffect(() => {
    const mockData: PortfolioSummary = {
      monthlyRentIn: 12500,
      allocatedReservePercentage: 0.25,
      forecastedYield: 0.068,
      euribor3M: 0.0325,
      germanCPI: 0.0246,
      cagrProjection: 0.092,
      threeYearProjection: [
        { year: 2023, amount: 150000 },
        { year: 2024, amount: 163800 },
        { year: 2025, amount: 178878 }
      ]
    };

    // Simulate loading and then setting the data
    setTimeout(() => {
      setPortfolioData(mockData);
      setLoading(false);
    }, 1500);
  }, []);

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner text="Loading portfolio data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorDisplay error={error.message || error.toString()} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p>No portfolio data found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Re-Investment Dashboard</h1>

      {/* Parallax Ticker Banner */}
      <div className="mb-8">
        <ParallaxBalanceTicker
          balance={portfolioData.monthlyRentIn}
          label="Total Monthly Rent"
          height={200}
        />
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ScrollRevealCard delay={0.1} direction="up">
          <Card className="h-full">
            <div className="flex flex-col h-full p-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Monthly Rent Income</h2>
              <div className="text-3xl font-bold text-blue-600 mb-3">
                ${portfolioData.monthlyRentIn.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Total monthly rental income across all properties.
              </p>
              <div className="mt-auto">
                <span className="text-sm font-medium text-green-600">
                  +2.5% from last month
                </span>
              </div>
            </div>
          </Card>
        </ScrollRevealCard>

        <ScrollRevealCard delay={0.2} direction="up">
          <Card className="h-full">
            <div className="flex flex-col h-full p-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Allocated to Reserve</h2>
              <div className="text-3xl font-bold text-purple-600 mb-3">
                {(portfolioData.allocatedReservePercentage * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Percentage of income allocated to your reserve fund.
              </p>
              <div className="mt-auto">
                <span className="text-sm font-medium text-amber-600">
                  Recommended: 30%
                </span>
              </div>
            </div>
          </Card>
        </ScrollRevealCard>

        <ScrollRevealCard delay={0.3} direction="up">
          <Card className="h-full">
            <div className="flex flex-col h-full p-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Forecasted Yield</h2>
              <div className="text-3xl font-bold text-green-600 mb-3">
                {(portfolioData.forecastedYield * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Projected annual return on your reinvestment strategy.
              </p>
              <div className="mt-auto">
                <span className="text-sm font-medium text-green-600">
                  {(portfolioData.euribor3M * 100).toFixed(2)}% above Euribor 3M
                </span>
              </div>
            </div>
          </Card>
        </ScrollRevealCard>
      </div>

      {/* 3D Gauge & Investment Projection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ScrollRevealCard direction="left">
          <Card className="h-full p-4">
            <h2 className="text-xl font-bold mb-4">Rent Collection Status</h2>
            <RentGauge3D 
              monthlyRent={portfolioData.monthlyRentIn * 0.93} // 93% collected for demo
              targetAmount={portfolioData.monthlyRentIn}
              height={400}
            />
          </Card>
        </ScrollRevealCard>

        <ScrollRevealCard direction="right">
          <Card className="h-full p-4">
            <h2 className="text-xl font-bold mb-6">3-Year Projection</h2>
            <div className="space-y-6">
              {portfolioData.threeYearProjection.map((projection, index) => (
                <motion.div 
                  key={projection.year}
                  className="bg-gray-50 p-4 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{projection.year}</div>
                      <div className="text-sm text-gray-500">Year {index + 1}</div>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ${projection.amount.toLocaleString()}
                    </div>
                  </div>
                  {index < portfolioData.threeYearProjection.length - 1 && (
                    <div className="mt-2 flex items-center">
                      <span className="text-xs text-green-600">
                        +{((portfolioData.threeYearProjection[index + 1].amount / projection.amount - 1) * 100).toFixed(1)}%
                      </span>
                      <svg className="w-4 h-4 text-green-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </ScrollRevealCard>
      </div>

      {/* Market Indicators */}
      <div className="mb-8">
        <ScrollRevealCard direction="up">
          <Card>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-6">Market Indicators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Euribor 3M</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(portfolioData.euribor3M * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">German CPI</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {(portfolioData.germanCPI * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </ScrollRevealCard>
      </div>
    </div>
  );
} 