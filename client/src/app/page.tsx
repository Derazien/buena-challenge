'use client';

import { useState, FormEvent } from 'react';
import MonthlyIncomeCard from "@/components/dashboard/MonthlyIncomeCard";
import OpenTicketsCard from "@/components/dashboard/OpenTicketsCard";
import UpcomingLeasesCard from "@/components/dashboard/UpcomingLeasesCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useProperties } from '@/hooks/useProperties';
import Input from "@/components/ui/Input";
import ParallaxBackground from '@/components/common/ParallaxBackground';
import ScrollAnimation from '@/components/common/ScrollAnimation';
import AnimatedText from '@/components/common/AnimatedText';

// Dynamically import the revenue chart to avoid SSR issues
const RevenueLineChart = dynamic(() => import('@/components/charts/RevenueLineChart'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center bg-buena-background/50 rounded-card p-6 shadow-card"><div className="animate-pulse bg-buena-border/30 h-full w-full rounded-md"></div></div>
});

export default function Dashboard() {
  const { loading, properties } = useProperties();

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl">
      <ScrollAnimation type="fade" once={false} threshold={0.1}>
        <ParallaxBackground
          height="200px"
          speed={0.3}
          backgroundClassName="bg-gradient-to-r from-gray-100 to-slate-200 dark:from-gray-800 dark:to-slate-900"
        >
          <div className="text-center w-full px-4">
            <AnimatedText
              text="Your Properties Dashboard"
              className="text-3xl font-bold text-foreground mb-2"
              animation="slide-up"
              type="word"
              staggerChildren={0.08}
            />
            <AnimatedText
              text={loading
                ? "Loading your properties..."
                : `Managing ${properties.length} ${properties.length === 1 ? 'property' : 'properties'} with detailed insights`
              }
              className="text-muted-foreground"
              animation="fade"
              delay={0.4}
            />
          </div>
        </ParallaxBackground>
      </ScrollAnimation>

      <div className="mt-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex space-x-3">
          <Link href="/properties">
            <Button variant="outline">
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

      <ScrollAnimation type="slide-up" once={false} threshold={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MonthlyIncomeCard />
          <OpenTicketsCard />
          <UpcomingLeasesCard />
        </div>
      </ScrollAnimation>

      <div className="mt-8">
        <ScrollAnimation type="slide-up" once={false} delay={0.2}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Revenue Overview</h2>
            <Button variant="outline" size="sm">
              Download Report
            </Button>
          </div>

          <Card className="p-6 overflow-hidden">
            <RevenueLineChart />
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  );
}
