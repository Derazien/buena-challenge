'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Tab } from '@/components/ui/Tab';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ScrollRevealCard from '@/components/portfolio/ScrollRevealCard';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PORTFOLIO_SUMMARY, GET_INVESTMENT_OPTIONS, ALLOCATE_FUNDS } from '@/graphql/portfolio.operations';
import { ReinvestmentWizard } from '@/components/investments/ReinvestmentWizard';

// Dynamically import components that use browser APIs to avoid hydration errors
const RentGauge2D = dynamic(() => import('@/components/portfolio/RentGauge2D'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-muted/30 rounded-md flex items-center justify-center">Loading visualization...</div>
});

const ParallaxBalanceTicker = dynamic(() => import('@/components/portfolio/ParallaxBalanceTicker'), {
    ssr: false,
    loading: () => <div className="h-[200px] bg-muted/30 rounded-md flex items-center justify-center">Loading ticker...</div>
});

// Import the PropertyModelModal component
const PropertyModelModal = dynamic(() => import('@/components/portfolio/PropertyModelModal'), {
    ssr: false,
    loading: () => <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"><LoadingSpinner text="Loading 3D models..." /></div>
});

// Sample 3D property data
const samplePropertyModels = [
    {
        id: 1,
        name: 'City Center Apartment',
        location: 'Berlin',
        type: 'apartment' as const,
        description: 'Elegantly designed apartment in the heart of Berlin with excellent access to public transport, restaurants, and shopping. This property offers modern comfort combined with classic architecture.',
        details: {
            size: 85,
            bedrooms: 2,
            yearBuilt: 2012,
            rentalYield: 4.2
        }
    },
    {
        id: 2,
        name: 'Period Apartment Building',
        location: 'München',
        type: 'building' as const,
        description: 'Impressive period building, fully renovated with modern amenities while preserving its historical charm. Ideal for investors seeking stable income in one of Germany\'s most desirable cities.',
        details: {
            size: 620,
            floors: 5,
            yearBuilt: 1928,
            rentalYield: 3.8
        }
    },
    {
        id: 3,
        name: 'New Riverside Apartment',
        location: 'Köln',
        type: 'apartment' as const,
        description: 'Luxurious new apartment with breathtaking views of the Rhine. This modern apartment offers premium living comfort with energy-efficient technology and first-class materials.',
        details: {
            size: 110,
            bedrooms: 3,
            yearBuilt: 2021,
            rentalYield: 4.6
        }
    },
    {
        id: 4,
        name: 'Historic Semi-Detached House',
        location: 'Hamburg',
        type: 'house' as const,
        description: 'Beautiful semi-detached house in a quiet district of Hamburg. This spacious property offers plenty of room for families and features a well-maintained garden perfect for relaxation.',
        details: {
            size: 180,
            bedrooms: 4,
            floors: 2,
            yearBuilt: 1956,
            rentalYield: 3.5
        }
    },
    {
        id: 5,
        name: 'Victorian Era Residential Complex',
        location: 'Frankfurt',
        type: 'building' as const,
        description: 'Imposing Victorian-era residential complex with luxurious details and modern amenities. This property offers excellent rental yield in one of Germany\'s strongest economic cities.',
        details: {
            size: 750,
            floors: 6,
            yearBuilt: 1901,
            rentalYield: 4.1
        }
    }
];

// Define investment suggestion types
type Investment = {
    id: string;
    name: string;
    type: string;
    expectedReturn: string;
    risk: string;
    minimumInvestment: string;
    description: string;
};

// New type for portfolio recommendations
type PortfolioRecommendation = {
    recommendedAmount: number;
    allocationPercentage: number;
    suggestedInvestments: Array<{
        investment: Investment;
        percentage: number;
        amount: number;
    }>;
    reasonsForRecommendation: string[];
};

// Investment suggestion mock data
const INVESTMENT_SUGGESTIONS: Investment[] = [
    {
        id: 'Vanguard Total Stock Market ETF (VTI)',
        name: 'Vanguard Total Stock Market ETF (VTI)',
        type: 'ETF',
        expectedReturn: '8-10%',
        risk: 'Medium',
        minimumInvestment: '€0',
        description: 'A low-cost ETF that tracks the performance of the entire U.S. stock market.'
    },
    {
        id: 'iShares Core EU Aggregate Bond ETF',
        name: 'iShares Core EU Aggregate Bond ETF',
        type: 'Bond ETF',
        expectedReturn: '3-5%',
        risk: 'Low',
        minimumInvestment: '€0',
        description: 'A bond ETF that provides exposure to the European investment-grade bond market.'
    },
    {
        id: 'SPDR EURO STOXX 50 ETF',
        name: 'SPDR EURO STOXX 50 ETF',
        type: 'REIT ETF',
        expectedReturn: '4-7%',
        risk: 'Medium-High',
        minimumInvestment: '€0',
        description: 'An ETF that tracks the performance of the EURO STOXX 50 Index.'
    },
    {
        id: 'iShares European Technology ETF',
        name: 'iShares European Technology ETF',
        type: 'Sector ETF',
        expectedReturn: '10-14%',
        risk: 'High',
        minimumInvestment: '€0',
        description: 'Focused exposure to European tech companies with high growth potential.'
    },
    {
        id: 'Xtrackers MSCI Europe ESG UCITS ETF',
        name: 'Xtrackers MSCI Europe ESG UCITS ETF',
        type: 'International ETF',
        expectedReturn: '6-9%',
        risk: 'Medium-High',
        minimumInvestment: '€0',
        description: 'Diversified exposure to European markets with ESG screening.'
    },
    {
        id: 'iShares European Property Yield UCITS ETF',
        name: 'iShares European Property Yield UCITS ETF',
        type: 'REIT ETF',
        expectedReturn: '5-8%',
        risk: 'Medium',
        minimumInvestment: '€0',
        description: 'Tracks European property companies and REITs with above-average dividend yields.'
    }
];

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
    availableToInvest: number;
    availableToReinvest: number;
    // Added property information
    properties: {
        id: number;
        name: string;
        location: string;
        monthlyRent: number;
        occupancyRate: number;
    }[];
    // Added portfolio data
    reserveBalance: number;
    monthlyGrowth: number;
    targetMonthlyRent: number;
    allocationBreakdown: {
        category: string;
        percentage: number;
        amount: number;
    }[];
    monthlyPerformance: {
        month: string;
        income: number;
    }[];
};

// Define types for the data structures
type Property = {
    id: number;
    name: string;
    location: string;
    monthlyRent: number;
    occupancyRate: number;
};

type Allocation = {
    category: string;
    percentage: number;
    amount: number;
};

type MonthlyPerformance = {
    month: string;
    income: number;
};

// Mock data for missing fields
const mockPortfolioData = {
    availableToInvest: 50000,
    availableToReinvest: 25000,
    properties: [
        {
            id: 1,
            name: 'City Center Apartment',
            location: 'Berlin',
            monthlyRent: 1200,
            occupancyRate: 0.95
        },
        {
            id: 2,
            name: 'Historic Multi-Family House',
            location: 'Munich',
            monthlyRent: 3500,
            occupancyRate: 0.98
        }
    ],
    reserveBalance: 10000,
    monthlyGrowth: 0.05,
    targetMonthlyRent: 10000,
    allocationBreakdown: [
        {
            category: 'Real Estate',
            percentage: 60,
            amount: 30000
        },
        {
            category: 'Bonds',
            percentage: 20,
            amount: 10000
        },
        {
            category: 'Stocks',
            percentage: 20,
            amount: 10000
        }
    ],
    monthlyPerformance: [
        {
            month: 'Jan',
            income: 4500
        },
        {
            month: 'Feb',
            income: 4700
        },
        {
            month: 'Mar',
            income: 4900
        }
    ]
};

// Simulated API function to get portfolio recommendations based on rental income and risk profile
const getPortfolioRecommendations = (
    monthlyRentIn: number,
    availableToReinvest: number,
    riskProfile: string
): PortfolioRecommendation => {
    // Determine recommended allocation percentage based on risk profile
    let allocationPercentage = 0;
    switch (riskProfile) {
        case 'conservative':
            allocationPercentage = 0.4; // 40% of available funds
            break;
        case 'moderate':
            allocationPercentage = 0.65; // 65% of available funds
            break;
        case 'aggressive':
            allocationPercentage = 0.85; // 85% of available funds
            break;
        default:
            allocationPercentage = 0.65;
    }

    // Calculate recommended investment amount
    const recommendedAmount = Math.round(availableToReinvest * allocationPercentage);

    // Filter investments based on risk profile
    let filteredInvestments = [...INVESTMENT_SUGGESTIONS];
    if (riskProfile === 'conservative') {
        filteredInvestments = filteredInvestments.filter(
            inv => inv.risk.toLowerCase() === 'low' || inv.risk.toLowerCase() === 'medium'
        );
    } else if (riskProfile === 'aggressive') {
        filteredInvestments = filteredInvestments.filter(
            inv => inv.risk.toLowerCase() === 'medium-high' || inv.risk.toLowerCase() === 'high'
        );
    }

    // For conservative profile: 60% bonds, 40% ETFs
    // For moderate profile: 40% bonds, 40% ETFs, 20% REITs
    // For aggressive profile: 20% bonds, 50% ETFs, 30% REITs/high risk
    let suggestedInvestments = [];

    if (riskProfile === 'conservative') {
        const bondInvestments = filteredInvestments.filter(inv => inv.type.includes('Bond'));
        const etfInvestments = filteredInvestments.filter(inv => !inv.type.includes('Bond') && !inv.type.includes('REIT'));

        suggestedInvestments = [
            ...bondInvestments.map(inv => ({
                investment: inv,
                percentage: 0.6 / bondInvestments.length,
                amount: Math.round((recommendedAmount * 0.6) / bondInvestments.length)
            })),
            ...etfInvestments.map(inv => ({
                investment: inv,
                percentage: 0.4 / etfInvestments.length,
                amount: Math.round((recommendedAmount * 0.4) / etfInvestments.length)
            }))
        ];
    } else if (riskProfile === 'moderate') {
        const bondInvestments = filteredInvestments.filter(inv => inv.type.includes('Bond'));
        const etfInvestments = filteredInvestments.filter(inv => !inv.type.includes('Bond') && !inv.type.includes('REIT'));
        const reitInvestments = filteredInvestments.filter(inv => inv.type.includes('REIT'));

        suggestedInvestments = [
            ...bondInvestments.map(inv => ({
                investment: inv,
                percentage: 0.4 / bondInvestments.length,
                amount: Math.round((recommendedAmount * 0.4) / bondInvestments.length)
            })),
            ...etfInvestments.map(inv => ({
                investment: inv,
                percentage: 0.4 / etfInvestments.length,
                amount: Math.round((recommendedAmount * 0.4) / etfInvestments.length)
            })),
            ...reitInvestments.map(inv => ({
                investment: inv,
                percentage: 0.2 / reitInvestments.length,
                amount: Math.round((recommendedAmount * 0.2) / reitInvestments.length)
            }))
        ];
    } else {
        const bondInvestments = filteredInvestments.filter(inv => inv.type.includes('Bond'));
        const etfInvestments = filteredInvestments.filter(inv => !inv.type.includes('Bond') && !inv.type.includes('REIT') && inv.risk !== 'High');
        const highRiskInvestments = filteredInvestments.filter(inv => inv.risk === 'High' || inv.type.includes('REIT'));

        suggestedInvestments = [
            ...bondInvestments.map(inv => ({
                investment: inv,
                percentage: 0.2 / bondInvestments.length,
                amount: Math.round((recommendedAmount * 0.2) / bondInvestments.length)
            })),
            ...etfInvestments.map(inv => ({
                investment: inv,
                percentage: 0.5 / etfInvestments.length,
                amount: Math.round((recommendedAmount * 0.5) / etfInvestments.length)
            })),
            ...highRiskInvestments.map(inv => ({
                investment: inv,
                percentage: 0.3 / highRiskInvestments.length,
                amount: Math.round((recommendedAmount * 0.3) / highRiskInvestments.length)
            }))
        ];
    }

    // Generate reasons for recommendation based on profile
    const reasonsForRecommendation = [];
    switch (riskProfile) {
        case 'conservative':
            reasonsForRecommendation.push(
                'Based on current Euribor rates and market stability indicators',
                'Higher bond allocation provides stability in uncertain market conditions',
                'Bond ETFs offer higher yields than typical savings accounts',
                'Recommended allocation preserves capital while still generating income'
            );
            break;
        case 'moderate':
            reasonsForRecommendation.push(
                'Balanced approach aligns with current market conditions',
                'Diversification across asset classes optimizes risk-reward ratio',
                'Real estate exposure through REITs provides income and inflation protection',
                'Current allocation outperforms German inflation indices by estimated 3.2%'
            );
            break;
        case 'aggressive':
            reasonsForRecommendation.push(
                'Tech sector shows strong growth potential in current environment',
                'Higher equity allocation capitalizes on market uptrend indicators',
                'Minimal bond allocation provides some downside protection',
                'International exposure diversifies currency risk and taps into emerging markets'
            );
            break;
    }

    return {
        recommendedAmount,
        allocationPercentage,
        suggestedInvestments,
        reasonsForRecommendation
    };
};

export default function InvestmentsPage() {
    // State
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [isMounted, setIsMounted] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [riskProfile, setRiskProfile] = useState('moderate');
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [portfolioRecommendation, setPortfolioRecommendation] = useState<PortfolioRecommendation | null>(null);
    const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
    const [optimizedPortfolioView, setOptimizedPortfolioView] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [show3DModelModal, setShow3DModelModal] = useState(false);
    const [showWizard, setShowWizard] = useState(false);

    // Investment Wizard State
    const [step, setStep] = useState(1);
    const [investmentAmount, setInvestmentAmount] = useState(0);
    const [fundingSource, setFundingSource] = useState<'new' | 'rental-income'>('rental-income');

    // GraphQL Queries
    const { data: portfolioData, loading: portfolioLoading, error: portfolioError } = useQuery(GET_PORTFOLIO_SUMMARY);
    const { data: investmentOptionsData, loading: investmentOptionsLoading } = useQuery(GET_INVESTMENT_OPTIONS, {
        variables: {
            surplusCash: mockPortfolioData.availableToReinvest,
            riskProfile: riskProfile
        },
        skip: !portfolioData?.portfolioSummary
    });
    const [allocateFunds, { loading: allocationLoading }] = useMutation(ALLOCATE_FUNDS);

    // Ensure the component is mounted before rendering client-side components
    useEffect(() => {
        setIsMounted(true);
    }, []);

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
            ],
            availableToInvest: 45000,
            availableToReinvest: 25000,
            // Added sample property data
            properties: [
                { id: 1, name: 'City Center Apartment', location: 'Berlin', monthlyRent: 2800, occupancyRate: 0.98 },
                { id: 2, name: 'Period Apartment Building', location: 'München', monthlyRent: 4200, occupancyRate: 0.95 },
                { id: 3, name: 'New Riverside Apartment', location: 'Köln', monthlyRent: 2100, occupancyRate: 0.96 },
                { id: 4, name: 'Historic Semi-Detached House', location: 'Hamburg', monthlyRent: 3400, occupancyRate: 0.92 },
                { id: 5, name: 'Victorian Era Residential Complex', location: 'Frankfurt', monthlyRent: 2750, occupancyRate: 0.94 }
            ],
            // Portfolio data
            reserveBalance: 24845,
            monthlyGrowth: 2.3,
            targetMonthlyRent: 18000,
            allocationBreakdown: [
                { category: 'Bonds', percentage: 25, amount: 6211.25 },
                { category: 'Real Estate Funds', percentage: 35, amount: 8695.75 },
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

        // Simulate loading and then setting the data
        const timer = setTimeout(() => {
            setPortfolioData(mockData);
            setInvestmentAmount(mockData.availableToReinvest);
            setLoading(false);

            // Get initial portfolio recommendation
            updatePortfolioRecommendation(mockData, 'moderate');
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Function to update portfolio recommendations
    const updatePortfolioRecommendation = (data: PortfolioSummary, profile: string) => {
        setIsRecommendationLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const recommendation = getPortfolioRecommendations(
                data.monthlyRentIn,
                data.availableToReinvest,
                profile
            );
            setPortfolioRecommendation(recommendation);
            setIsRecommendationLoading(false);
        }, 800);
    };

    // Track scroll position for animations
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Function to get appropriate badge variant based on risk level
    const getRiskBadgeVariant = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return 'default';
            case 'medium': return 'info';
            case 'medium-high': return 'warning';
            case 'high': return 'danger';
            default: return 'default';
        }
    };

    const handleNextStep = () => {
        setStep(Math.min(step + 1, 3));
    };

    const handlePrevStep = () => {
        setStep(Math.max(step - 1, 1));
    };

    const handleInvestNow = (investment: Investment) => {
        setSelectedInvestment(investment);
        setStep(1);
        setShowInvestmentModal(true);
    };

    const handleConfirmInvestment = async () => {
        if (!selectedInvestment) return;

        try {
            const result = await allocateFunds({
                variables: {
                    input: {
                        amount: investmentAmount,
                        investmentId: selectedInvestment.id,
                        riskProfile: riskProfile
                    }
                }
            });

            if (result.data.allocateFunds.success) {
                setShowInvestmentModal(false);
                setShowConfetti(true);
            } else {
                // Handle error
                console.error('Failed to allocate funds:', result.data.allocateFunds.message);
            }
        } catch (error) {
            console.error('Error allocating funds:', error);
        }
    };

    const handleAcceptOptimizedPortfolio = () => {
        // In a real app, this would call an API to accept the optimized portfolio
        setOptimizedPortfolioView(false);
        setShowConfetti(true);
    };

    // Use mock data for missing fields
    const portfolioDataWithMock = {
        ...portfolioData?.portfolioSummary,
        ...mockPortfolioData
    };

    if (portfolioLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <LoadingSpinner text="Loading your investment dashboard..." />
            </div>
        );
    }

    if (portfolioError) {
        return (
            <div className="container mx-auto py-8">
                <ErrorDisplay error={portfolioError.message} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    if (!portfolioData?.portfolioSummary || !isMounted) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <LoadingSpinner text="Preparing investment dashboard..." />
            </div>
        );
    }

    // Define tabs for the interface
    const tabs = [
        { label: 'Overview', value: 'overview' },
        { label: 'Investment Opportunities', value: 'opportunities' },
        { label: 'Portfolio Analysis', value: 'portfolio' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Investment Hub</h1>
                    <p className="text-muted-foreground mt-1">Manage, analyze, and optimize your property investments</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowInvestmentModal(true)}
                    >
                        New Investment
                    </Button>
                    <Button
                        onClick={() => {
                            setShowConfetti(true);
                            handleAcceptOptimizedPortfolio();
                        }}
                    >
                        Optimize Portfolio
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <Tab
                tabs={tabs}
                value={activeTab}
                onChange={setActiveTab}
                variant="underline"
                size="md"
            />

            <div className="mt-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Investment Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 md:col-span-2">
                                <h2 className="text-xl font-semibold mb-4">Rental Income Overview</h2>

                                {isMounted && (
                                    <div className="h-[400px]">
                                        <RentGauge2D
                                            monthlyRent={portfolioDataWithMock.monthlyRentIn}
                                            targetAmount={portfolioDataWithMock.targetMonthlyRent}
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="bg-muted/20 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Rental Income</h3>
                                        <div className="flex items-center">
                                            <p className="text-2xl font-bold">€{portfolioDataWithMock.monthlyRentIn.toLocaleString()}</p>
                                            <span className="ml-2 text-sm text-green-600">+{portfolioDataWithMock.monthlyGrowth.toLocaleString('en-US').replace('.', ',')}%</span>
                                        </div>
                                    </div>
                                    <div className="bg-muted/20 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Available for Investment</h3>
                                        <p className="text-2xl font-bold">€{portfolioData.availableToReinvest.toLocaleString('de-DE')}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Market Metrics</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Forecasted Annual Return</h3>
                                        <p className="text-2xl font-bold">{(portfolioData.forecastedYield * 100).toFixed(2).replace('.', ',')}%</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Euribor 3M</h3>
                                        <p className="text-lg">{(portfolioDataWithMock.euribor3M * 100).toFixed(2).replace('.', ',')}%</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">German CPI</h3>
                                        <p className="text-lg">{(portfolioData.germanCPI * 100).toFixed(2).replace('.', ',')}%</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">CAGR Forecast</h3>
                                        <p className="text-lg">{(portfolioData.cagrProjection * 100).toFixed(2).replace('.', ',')}%</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Property Income Breakdown */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Property Income Overview</h2>
                                <Button
                                    onClick={() => setShow3DModelModal(true)}
                                    className="flex items-center gap-1.5 text-sm"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3a7 7 0 0 0-7 7v4h14v-4a7 7 0 0 0-7-7Z" />
                                        <path d="M5 14v1a7 7 0 0 0 14 0v-1" />
                                        <path d="M8 14v1a4 4 0 0 0 8 0v-1" />
                                    </svg>
                                    View 3D Models
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Property</th>
                                            <th className="text-left py-3 px-4">Location</th>
                                            <th className="text-right py-3 px-4">Monthly Rent</th>
                                            <th className="text-right py-3 px-4">Occupancy Rate</th>
                                            <th className="text-right py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolioDataWithMock.properties.map((property: Property) => (
                                            <tr key={property.id} className="border-b hover:bg-muted/10">
                                                <td className="py-3 px-4">{property.name}</td>
                                                <td className="py-3 px-4">{property.location}</td>
                                                <td className="py-3 px-4 text-right">€{property.monthlyRent.toLocaleString('en-US')}</td>
                                                <td className="py-3 px-4 text-right">{(property.occupancyRate * 100).toFixed(0)}%</td>
                                                <td className="py-3 px-4 text-right">
                                                    <Badge variant={property.occupancyRate > 0.9 ? "success" : "warning"}>
                                                        {property.occupancyRate > 0.95 ? "Excellent" : property.occupancyRate > 0.9 ? "Very Good" : "Good"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        {/* Portfolio Allocation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 md:col-span-2">
                                <h2 className="text-xl font-semibold mb-4">Portfolio Allocation</h2>
                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {portfolioDataWithMock.allocationBreakdown.map((allocation: Allocation, index: number) => {
                                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'];
                                            const textColors = ['text-blue-500', 'text-green-500', 'text-amber-500', 'text-purple-500'];
                                            return (
                                                <div key={allocation.category} className="flex items-center text-sm">
                                                    <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-sm mr-1`}></div>
                                                    <span className={`${textColors[index % textColors.length]} font-medium`}>
                                                        {allocation.category} ({allocation.percentage}%)
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="h-8 w-full rounded-md overflow-hidden flex">
                                        {portfolioDataWithMock.allocationBreakdown.map((allocation: Allocation, index: number) => {
                                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'];
                                            return (
                                                <div
                                                    key={allocation.category}
                                                    className={`${colors[index % colors.length]} h-full`}
                                                    style={{ width: `${allocation.percentage}%` }}
                                                    title={`${allocation.category}: ${allocation.percentage}%`}
                                                ></div>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-3 mt-6">
                                        {portfolioDataWithMock.allocationBreakdown.map((allocation: Allocation, index: number) => (
                                            <div key={allocation.category} className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="w-1 h-8 bg-blue-500 mr-3" style={{
                                                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]
                                                    }}></div>
                                                    <div>
                                                        <div className="font-medium">{allocation.category}</div>
                                                        <div className="text-xs text-muted-foreground">{allocation.percentage}% of Portfolio</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">€{allocation.amount.toLocaleString('en-US')}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Monthly Performance</h2>
                                <div className="h-[250px] flex items-end space-x-2">
                                    {portfolioDataWithMock.monthlyPerformance.map((data: MonthlyPerformance) => {
                                        const maxIncome = Math.max(...portfolioDataWithMock.monthlyPerformance.map((d: MonthlyPerformance) => d.income));
                                        const height = (data.income / maxIncome) * 200;

                                        return (
                                            <div key={data.month} className="flex flex-col items-center flex-1">
                                                <div
                                                    className="w-full bg-blue-500 rounded-t-md"
                                                    style={{ height: `${height}px` }}
                                                ></div>
                                                <div className="mt-2 text-center">
                                                    <div className="text-xs font-medium">{data.month}</div>
                                                    <div className="text-xs text-muted-foreground">€{data.income.toLocaleString('en-US')}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Investment Opportunities Tab */}
                {activeTab === 'opportunities' && (
                    <div className="space-y-8">
                        {/* Investment Recommendations */}
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Investment Opportunities</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {INVESTMENT_SUGGESTIONS.map((investment, idx) => (
                                    <Card key={idx} className="p-4 h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium">{investment.name}</h4>
                                            <Badge variant={getRiskBadgeVariant(investment.risk)}>
                                                {investment.risk}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{investment.type}</p>
                                        <p className="text-sm mb-4">{investment.description}</p>
                                        <div className="mt-auto space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Expected Return:</span>
                                                <span className="text-sm font-medium">{investment.expectedReturn}</span>
                                            </div>
                                            <Button
                                                className="w-full mt-2"
                                                onClick={() => handleInvestNow(investment)}
                                            >
                                                Invest Now
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Portfolio Analysis Tab */}
                {activeTab === 'portfolio' && (
                    <div className="space-y-8">
                        {/* Total Earnings Summary */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Total Earnings from Properties</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-primary/5 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Income</h3>
                                    <p className="text-2xl font-bold">€{portfolioDataWithMock.monthlyRentIn.toLocaleString()}</p>
                                    <p className="text-sm text-green-600 mt-1">+{portfolioDataWithMock.monthlyGrowth.toLocaleString('en-US').replace('.', ',')}% from last month</p>
                                </div>

                                <div className="bg-primary/5 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Annual Income</h3>
                                    <p className="text-2xl font-bold">€{(portfolioDataWithMock.monthlyRentIn * 12).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Based on current rates</p>
                                </div>

                                <div className="bg-primary/5 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Properties</h3>
                                    <p className="text-2xl font-bold">{portfolioDataWithMock.properties.length}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Across {new Set(portfolioDataWithMock.properties.map((p: Property) => p.location)).size} locations</p>
                                </div>

                                <div className="bg-primary/5 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg. Occupancy</h3>
                                    <p className="text-2xl font-bold">
                                        {(portfolioDataWithMock.properties.reduce((sum: number, p: Property) => sum + p.occupancyRate, 0) /
                                            portfolioDataWithMock.properties.length * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Across all properties</p>
                                </div>
                            </div>
                        </Card>

                        {/* Earnings Breakdown by Property */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Earnings Breakdown by Property</h2>
                            <div className="space-y-6">
                                {portfolioDataWithMock.properties.map((property: Property) => {
                                    const annualRent = property.monthlyRent * 12;
                                    const maintenanceCost = annualRent * 0.15; // Estimate 15% for maintenance
                                    const taxes = annualRent * 0.2; // Estimate 20% for property taxes
                                    const netIncome = annualRent - maintenanceCost - taxes;
                                    const roi = (netIncome / (property.monthlyRent * 100)) * 100; // Rough ROI calculation

                                    return (
                                        <div key={property.id} className="border rounded-lg overflow-hidden">
                                            <div className="bg-muted/10 p-4 flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium">{property.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{property.location}</p>
                                                </div>
                                                <Badge variant={property.occupancyRate > 0.9 ? "success" : "warning"}>
                                                    {(property.occupancyRate * 100).toFixed(0)}% Occupied
                                                </Badge>
                                            </div>

                                            <div className="p-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Monthly Rent</p>
                                                        <p className="font-medium">€{property.monthlyRent.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Annual Income</p>
                                                        <p className="font-medium">€{annualRent.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Net Income</p>
                                                        <p className="font-medium">€{netIncome.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Est. ROI</p>
                                                        <p className="font-medium text-green-600">{roi.toFixed(1)}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 border-t bg-muted/5">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm">Investment Potential from This Property</p>
                                                    <p className="font-medium">€{(netIncome * 0.7).toLocaleString()} / year</p>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="w-full bg-muted/30 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${property.occupancyRate * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Investment Projections */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Investment Projections from Rental Income</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-3">5-Year Projection</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Current Available</span>
                                            <span>€{portfolioDataWithMock.availableToReinvest.toLocaleString()}</span>
                                        </div>

                                        {/* Generate 5 year projection with compounding */}
                                        {[1, 2, 3, 4, 5].map(year => {
                                            const amount = portfolioDataWithMock.availableToReinvest *
                                                Math.pow(1 + portfolioDataWithMock.forecastedYield, year);
                                            return (
                                                <div key={year} className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Year {year}</span>
                                                    <span>€{amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3">Where to Invest</h3>

                                    <div className="space-y-3">
                                        {portfolioDataWithMock.allocationBreakdown.map((allocation: Allocation, idx: number) => (
                                            <div key={allocation.category} className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-10 mr-3" style={{
                                                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][idx % 4]
                                                    }}></div>
                                                    <div>
                                                        <p className="font-medium">{allocation.category}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {allocation.category === 'Bonds' && 'Lower risk, stable returns'}
                                                            {allocation.category === 'REITs' && 'Real estate investment trusts'}
                                                            {allocation.category === 'Stocks' && 'Higher growth potential'}
                                                            {allocation.category === 'Cash' && 'Liquid reserves'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{allocation.percentage}%</p>
                                                    <p className="text-xs text-muted-foreground">Recommended</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        <Button
                                            onClick={() => setActiveTab('opportunities')}
                                        >
                                            View Investment Opportunities
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Potential Growth Comparison</h3>
                                <div className="relative h-[200px] border-b border-l">
                                    {/* Conservative Growth Line */}
                                    <div className="absolute bottom-0 left-0 h-[50px] w-full border-t border-blue-300 border-dashed"></div>
                                    <div className="absolute bottom-0 left-0 text-xs text-blue-500">Conservative 3%</div>

                                    {/* Moderate Growth Line */}
                                    <div className="absolute bottom-0 left-0 h-[100px] w-full border-t border-green-300 border-dashed"></div>
                                    <div className="absolute bottom-[100px] left-0 text-xs text-green-500">Moderate 6%</div>

                                    {/* Aggressive Growth Line */}
                                    <div className="absolute bottom-0 left-0 h-[150px] w-full border-t border-amber-300 border-dashed"></div>
                                    <div className="absolute bottom-[150px] left-0 text-xs text-amber-500">Aggressive 9%</div>

                                    {/* Current Plan Line */}
                                    <div className="absolute bottom-0 left-0 h-[120px] w-full border-t border-primary border-dashed"></div>
                                    <div className="absolute bottom-[120px] left-0 text-xs text-primary">Your Plan {(portfolioDataWithMock.forecastedYield * 100).toFixed(1)}%</div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>Year 1</span>
                                    <span>Year 2</span>
                                    <span>Year 3</span>
                                    <span>Year 4</span>
                                    <span>Year 5</span>
                                </div>
                            </div>
                        </Card>

                        {/* Real-Time Investment Opportunities */}
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Real-Time Investment Opportunities</h2>
                                <Badge>Based on your rental income</Badge>
                            </div>

                            <p className="mb-6">
                                With your current rental income of <strong>€{portfolioDataWithMock.monthlyRentIn.toLocaleString()}</strong> per month,
                                you can accelerate wealth growth by investing in these opportunities:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10">
                                        <h3 className="font-medium">European REITs</h3>
                                        <p className="text-sm text-muted-foreground">Monthly Investment: €3,750</p>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm mb-3">European Real Estate Investment Trusts (REITs) offer stable income from diversified properties across the continent.</p>
                                        <div className="flex justify-between text-sm">
                                            <span>Expected Return:</span>
                                            <span className="font-medium">6-8% annually</span>
                                        </div>
                                        <Button className="w-full mt-3" size="sm" variant="outline">
                                            Learn More
                                        </Button>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/10">
                                        <h3 className="font-medium">Bond ETF Portfolio</h3>
                                        <p className="text-sm text-muted-foreground">Monthly Investment: €2,500</p>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm mb-3">A diversified bond ETF portfolio provides stable income with lower risk than equity investments.</p>
                                        <div className="flex justify-between text-sm">
                                            <span>Expected Return:</span>
                                            <span className="font-medium">3-5% annually</span>
                                        </div>
                                        <Button className="w-full mt-3" size="sm" variant="outline">
                                            Learn More
                                        </Button>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10">
                                        <h3 className="font-medium">Tech Growth Fund</h3>
                                        <p className="text-sm text-muted-foreground">Monthly Investment: €1,250</p>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm mb-3">Higher risk investment in technology growth companies with potential for significant returns.</p>
                                        <div className="flex justify-between text-sm">
                                            <span>Expected Return:</span>
                                            <span className="font-medium">10-15% annually</span>
                                        </div>
                                        <Button className="w-full mt-3" size="sm" variant="outline">
                                            Learn More
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    onClick={() => {
                                        setShowInvestmentModal(true);
                                        setSelectedInvestment(INVESTMENT_SUGGESTIONS[0]);
                                    }}
                                >
                                    Start Investing Now
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Investment Modal */}
            {showInvestmentModal && selectedInvestment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Invest in {selectedInvestment.name}</h2>
                            <Button variant="ghost" onClick={() => setShowInvestmentModal(false)}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Investment Details */}
                            <div className="bg-muted/10 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Type:</span>
                                    <span className="text-sm font-medium">{selectedInvestment.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Expected Return:</span>
                                    <span className="text-sm font-medium">{selectedInvestment.expectedReturn}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Risk Level:</span>
                                    <Badge variant={getRiskBadgeVariant(selectedInvestment.risk)}>
                                        {selectedInvestment.risk}
                                    </Badge>
                                </div>
                            </div>

                            {/* Funding Source */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Funding Source
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setFundingSource('rental-income');
                                            setInvestmentAmount(portfolioData.availableToReinvest);
                                        }}
                                        className={`p-4 border rounded-lg text-left transition-colors ${fundingSource === 'rental-income'
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:bg-muted/10'
                                            }`}
                                    >
                                        <span className="block font-medium">Rental Income</span>
                                        <span className="block text-sm text-muted-foreground">
                                            €{portfolioData.availableToReinvest.toLocaleString()} available
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFundingSource('new');
                                            setInvestmentAmount(portfolioData.availableToInvest);
                                        }}
                                        className={`p-4 border rounded-lg text-left transition-colors ${fundingSource === 'new'
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:bg-muted/10'
                                            }`}
                                    >
                                        <span className="block font-medium">New Funds</span>
                                        <span className="block text-sm text-muted-foreground">
                                            €{portfolioData.availableToInvest.toLocaleString()} available
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Investment Amount */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="investment-amount" className="block text-sm font-medium">
                                        Investment Amount
                                    </label>
                                    <span className="text-lg font-semibold">€{investmentAmount.toLocaleString()}</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range"
                                        id="investment-amount"
                                        min="0"
                                        max={fundingSource === 'rental-income' ? portfolioData.availableToReinvest : portfolioData.availableToInvest}
                                        step={Math.max(100, Math.floor((fundingSource === 'rental-income' ? portfolioData.availableToReinvest : portfolioData.availableToInvest) / 100))}
                                        value={investmentAmount}
                                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>€0</span>
                                        <span>€{(fundingSource === 'rental-income' ? portfolioData.availableToReinvest : portfolioData.availableToInvest).toLocaleString()}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Available: €{(fundingSource === 'rental-income' ? portfolioData.availableToReinvest : portfolioData.availableToInvest).toLocaleString()}
                                </p>
                            </div>

                            {/* Confirm Button */}
                            <Button
                                className="w-full"
                                onClick={handleConfirmInvestment}
                                disabled={investmentAmount <= 0 || investmentAmount > (fundingSource === 'rental-income' ? portfolioData.availableToReinvest : portfolioData.availableToInvest)}
                            >
                                Confirm Investment
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Property 3D Model Modal */}
            <PropertyModelModal
                isOpen={show3DModelModal}
                onClose={() => setShow3DModelModal(false)}
                properties={samplePropertyModels}
            />

            {showWizard && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <ReinvestmentWizard onComplete={() => setShowWizard(false)} />
                </div>
            )}
        </div>
    );
}