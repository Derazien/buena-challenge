'use client';

import { useState } from 'react';
import MonthlyIncomeCard from "@/components/dashboard/MonthlyIncomeCard";
import OpenTicketsCard from "@/components/dashboard/OpenTicketsCard";
import UpcomingLeasesCard from "@/components/dashboard/UpcomingLeasesCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useProperties } from '@/hooks/useProperties';

// Dynamically import the revenue chart to avoid SSR issues
const RevenueLineChart = dynamic(() => import('@/components/charts/RevenueLineChart'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center dark:bg-neutral-800/50 bg-neutral-100 rounded-xl p-6"><div className="animate-pulse bg-neutral-200 dark:bg-neutral-700 h-full w-full rounded-md"></div></div>
});

export default function Dashboard() {
  const { loading, properties } = useProperties();

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-neutral-900">Your Properties Dashboard</h1>
          <p className="dark:text-neutral-400 text-neutral-500 mt-1">
            {loading
              ? "Loading your properties..."
              : `Managing ${properties.length} ${properties.length === 1 ? 'property' : 'properties'} with detailed insights`
            }
          </p>
        </div>

        <div className="flex space-x-3">
          <Link href="/properties">
            <Button variant="outline" className="transition-colors duration-200">
              View Properties
            </Button>
          </Link>
          <Link href="/reinvest">
            <Button>
              Reinvest
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MonthlyIncomeCard />
        <OpenTicketsCard />
        <UpcomingLeasesCard />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white text-neutral-900">Revenue Overview</h2>
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>

        <Card className="dark:bg-neutral-800/50 bg-white p-6 overflow-hidden">
          <RevenueLineChart />
        </Card>
      </div>
    </div>
  );
} 