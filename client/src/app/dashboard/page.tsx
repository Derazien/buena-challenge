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
import AnimatedText from '@/components/common/AnimatedText';
import { motion } from 'framer-motion';

// Dynamically import the revenue chart to avoid SSR issues
const RevenueLineChart = dynamic(() => import('@/components/charts/RevenueLineChart'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center dark:bg-neutral-800/50 bg-neutral-100 rounded-xl p-6"><div className="animate-pulse bg-neutral-200 dark:bg-neutral-700 h-full w-full rounded-md"></div></div>
});

export default function Dashboard() {
  const { loading, properties } = useProperties();

  return (
    <div className="mx-auto px-4 pb-12 pt-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 bg-gradient-to-r from-background to-muted rounded-xl p-6 shadow-sm border border-border"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AnimatedText
                text="Your Properties Dashboard"
                animation="slide-up"
                once={false}
                type="word"
              />
            </h1>
            <div className="mt-2 flex items-center">
              <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium mr-2">
                {loading ? "..." : properties.length}
              </div>
              <p className="text-muted-foreground">
                {loading
                  ? "Loading your properties..."
                  : `Managing ${properties.length} ${properties.length === 1 ? 'property' : 'properties'} with detailed insights`
                }
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Link href="/properties">
              <Button variant="outline" className="transition-colors duration-200 shadow-sm">
                View Properties
              </Button>
            </Link>
            <Link href="/reinvest">
              <Button className="shadow-sm">
                Reinvest
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MonthlyIncomeCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <OpenTicketsCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <UpcomingLeasesCard />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xl font-semibold text-foreground">Revenue Overview</h2>
          <Button variant="outline" size="sm" className="shadow-sm">
            Download Report
          </Button>
        </div>

        <Card className="bg-card p-6 overflow-hidden shadow-md">
          <RevenueLineChart />
        </Card>
      </motion.div>
    </div>
  );
}