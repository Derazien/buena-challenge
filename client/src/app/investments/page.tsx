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

// Dynamically import components that use browser APIs to avoid hydration errors
const RentGauge3D = dynamic(() => import('@/components/portfolio/RentGauge3D'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-muted/30 rounded-md flex items-center justify-center">Loading 3D visualization...</div>
});

const ParallaxBalanceTicker = dynamic(() => import('@/components/portfolio/ParallaxBalanceTicker'), {
    ssr: false,
    loading: () => <div className="h-[200px] bg-muted/30 rounded-md flex items-center justify-center">Loading ticker...</div>
});

// Define investment suggestion types
type Investment = {
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
        name: 'Vanguard Total Stock Market ETF (VTI)',
        type: 'ETF',
        expectedReturn: '8-10%',
        risk: 'Medium',
        minimumInvestment: '$0',
        description: 'A low-cost ETF that tracks the performance of the entire U.S. stock market.'
    },
    {
        name: 'iShares Core U.S. Aggregate Bond ETF (AGG)',
        type: 'Bond ETF',
        expectedReturn: '3-5%',
        risk: 'Low',
        minimumInvestment: '$0',
        description: 'A bond ETF that provides exposure to the total U.S. investment-grade bond market.'
    },
    {
        name: 'Schwab U.S. REIT ETF (SCHH)',
        type: 'REIT ETF',
        expectedReturn: '4-7%',
        risk: 'Medium-High',
        minimumInvestment: '$0',
        description: 'An ETF that tracks the performance of U.S. Real Estate Investment Trusts (REITs).'
    },
    {
        name: 'BlackRock Global Technology ETF',
        type: 'Sector ETF',
        expectedReturn: '10-14%',
        risk: 'High',
        minimumInvestment: '$0',
        description: 'Focused exposure to global tech companies with high growth potential.'
    },
    {
        name: 'Dimensional International Core Equity',
        type: 'International ETF',
        expectedReturn: '6-9%',
        risk: 'Medium-High',
        minimumInvestment: '$0',
        description: 'Diversified exposure to developed international markets outside the U.S.'
    },
    {
        name: 'Vanguard Real Estate ETF (VNQ)',
        type: 'REIT ETF',
        expectedReturn: '5-8%',
        risk: 'Medium',
        minimumInvestment: '$0',
        description: 'Tracks the MSCI US Investable Market Real Estate 25/50 Index.'
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
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [portfolioData, setPortfolioData] = useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [investmentSuggestions, setInvestmentSuggestions] = useState<Investment[]>(INVESTMENT_SUGGESTIONS);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [riskProfile, setRiskProfile] = useState('moderate');
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [investmentSource, setInvestmentSource] = useState<'new' | 'reinvest'>('new');
    const [portfolioRecommendation, setPortfolioRecommendation] = useState<PortfolioRecommendation | null>(null);
    const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
    const [optimizedPortfolioView, setOptimizedPortfolioView] = useState(false);

    // Investment Wizard State
    const [step, setStep] = useState(1);
    const [investmentAmount, setInvestmentAmount] = useState(0);

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
            availableToReinvest: 25000
        };

        // Simulate loading and then setting the data
        const timer = setTimeout(() => {
            setPortfolioData(mockData);
            setInvestmentAmount(mockData.availableToInvest);
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

    // Update portfolio recommendation when risk profile changes
    useEffect(() => {
        if (portfolioData) {
            updatePortfolioRecommendation(portfolioData, riskProfile);
        }
    }, [riskProfile]);

    // Filter investment suggestions based on risk profile
    useEffect(() => {
        // In a real app, this would call an API with the risk profile
        // For now, we'll just simulate different results for different profiles
        let filteredSuggestions = [...INVESTMENT_SUGGESTIONS];

        if (riskProfile === 'conservative') {
            filteredSuggestions = filteredSuggestions.filter(
                inv => inv.risk.toLowerCase() === 'low' || inv.risk.toLowerCase() === 'medium'
            );
        } else if (riskProfile === 'aggressive') {
            filteredSuggestions = filteredSuggestions.filter(
                inv => inv.risk.toLowerCase() === 'medium-high' || inv.risk.toLowerCase() === 'high'
            );
        }

        setInvestmentSuggestions(filteredSuggestions);
    }, [riskProfile]);

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

    const handleInvestNow = (investment: Investment, source: 'new' | 'reinvest') => {
        setSelectedInvestment(investment);
        setInvestmentSource(source);
        setActiveTab('invest');
        setStep(1);

        // Set initial investment amount based on source
        if (portfolioData) {
            setInvestmentAmount(source === 'new'
                ? portfolioData.availableToInvest
                : portfolioData.availableToReinvest);
        }
    };

    const handleConfirmInvestment = () => {
        if (!selectedInvestment) return;

        // Here would be the API call to process the investment
        // For now, we'll just show success via the state change
        setStep(3);
    };

    // Handle accepting optimized portfolio
    const handleAcceptOptimizedPortfolio = () => {
        if (!portfolioRecommendation) return;

        setActiveTab('invest');
        setStep(2);

        // We'd normally call an API here to initialize the portfolio investments
        // For now, just simulate it by selecting the first investment
        if (portfolioRecommendation.suggestedInvestments.length > 0) {
            const firstSuggestion = portfolioRecommendation.suggestedInvestments[0];
            setSelectedInvestment(firstSuggestion.investment);
            setInvestmentAmount(portfolioRecommendation.recommendedAmount);
            setInvestmentSource('reinvest');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <LoadingSpinner text="Loading investment data..." />
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

    if (!portfolioData || !isMounted) {
        return (
            <div className="container mx-auto px-4 py-16">
                <LoadingSpinner text="Preparing investment dashboard..." />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Investment Center</h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                <div className="flex space-x-8">
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'dashboard'
                            ? 'border-b-2 border-primary text-primary dark:text-primary-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'invest'
                            ? 'border-b-2 border-primary text-primary dark:text-primary-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                        onClick={() => setActiveTab('invest')}
                    >
                        Invest Now
                    </button>
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'reinvest'
                            ? 'border-b-2 border-primary text-primary dark:text-primary-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                        onClick={() => setActiveTab('reinvest')}
                    >
                        Re-Investment
                    </button>
                </div>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <div>
                    {/* Parallax Ticker Banner */}
                    <div className="mb-8">
                        <ParallaxBalanceTicker
                            balance={portfolioData.monthlyRentIn}
                            label="Total Monthly Rent"
                            height={200}
                        />
                    </div>

                    {/* AI Portfolio Optimizer Section */}
                    <div className="mb-12">
                        <Card className="border-2 border-blue-500/20 dark:border-blue-700/30">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold dark:text-white flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                        AI Portfolio Optimizer
                                    </h2>
                                    <Badge variant="info">Automated Recommendations</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Available for Re-Investment</div>
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            ${portfolioData.availableToReinvest.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Current Risk Profile</div>
                                        <div className="flex items-center">
                                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                                                {riskProfile}
                                            </div>
                                            <button
                                                onClick={() => setOptimizedPortfolioView(!optimizedPortfolioView)}
                                                className="ml-3 text-xs text-blue-600 dark:text-blue-400 underline"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Recommended Allocation</div>
                                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                            {portfolioRecommendation ?
                                                `$${portfolioRecommendation.recommendedAmount.toLocaleString()}` :
                                                "Calculating..."}
                                        </div>
                                    </div>
                                </div>

                                {isRecommendationLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                                            <p className="mt-4 text-gray-600 dark:text-gray-400">Optimizing your portfolio...</p>
                                        </div>
                                    </div>
                                ) : optimizedPortfolioView ? (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium mb-4 dark:text-white">Select Your Risk Profile</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <button
                                                onClick={() => setRiskProfile('conservative')}
                                                className={`p-6 border rounded-lg text-left transition-all ${riskProfile === 'conservative'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                                    : 'border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800'
                                                    }`}
                                            >
                                                <h3 className="text-md font-medium mb-2 dark:text-white">Conservative</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Lower risk investments with stable but modest returns.
                                                </p>
                                            </button>

                                            <button
                                                onClick={() => setRiskProfile('moderate')}
                                                className={`p-6 border rounded-lg text-left transition-all ${riskProfile === 'moderate'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                                    : 'border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800'
                                                    }`}
                                            >
                                                <h3 className="text-md font-medium mb-2 dark:text-white">Moderate</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Balanced approach with a mix of growth and income investments.
                                                </p>
                                            </button>

                                            <button
                                                onClick={() => setRiskProfile('aggressive')}
                                                className={`p-6 border rounded-lg text-left transition-all ${riskProfile === 'aggressive'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                                    : 'border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800'
                                                    }`}
                                            >
                                                <h3 className="text-md font-medium mb-2 dark:text-white">Aggressive</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Higher risk investments with potential for significant returns.
                                                </p>
                                            </button>
                                        </div>
                                        <Button
                                            onClick={() => setOptimizedPortfolioView(false)}
                                            variant="primary"
                                            size="sm"
                                        >
                                            Apply Selection
                                        </Button>
                                    </div>
                                ) : portfolioRecommendation ? (
                                    <>
                                        <div className="mb-6">
                                            <h3 className="text-lg font-medium mb-4 dark:text-white">Optimized Portfolio</h3>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recommended Amount</h4>
                                                        <div className="text-lg font-semibold dark:text-white">${portfolioRecommendation.recommendedAmount.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {(portfolioRecommendation.allocationPercentage * 100).toFixed(0)}% of available re-investment funds
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Expected Annual Return</h4>
                                                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                            {(portfolioData.forecastedYield * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                            {((portfolioData.forecastedYield - portfolioData.germanCPI) * 100).toFixed(1)}% above inflation
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Risk Level</h4>
                                                        <div className="text-lg font-semibold dark:text-white capitalize">{riskProfile}</div>
                                                    </div>
                                                </div>

                                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Allocation Breakdown</h4>
                                                <div className="space-y-3">
                                                    {portfolioRecommendation.suggestedInvestments.map((item, index) => (
                                                        <div key={index} className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <div className="w-1 h-8 bg-blue-500 mr-3"></div>
                                                                <div>
                                                                    <div className="font-medium dark:text-white">{item.investment.name}</div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.investment.type}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-medium dark:text-white">${item.amount.toLocaleString()}</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">{(item.percentage * 100).toFixed(1)}%</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                                                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Why we recommend this portfolio</h4>
                                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                    {portfolioRecommendation.reasonsForRecommendation.map((reason, index) => (
                                                        <li key={index}>{reason}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4">
                                            <Button
                                                onClick={() => setOptimizedPortfolioView(true)}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Adjust Risk Profile
                                            </Button>
                                            <Button
                                                onClick={handleAcceptOptimizedPortfolio}
                                                variant="primary"
                                                size="sm"
                                            >
                                                Accept Recommendation
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-center items-center py-8">
                                        <p className="text-gray-600 dark:text-gray-400">No recommendations available.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Summary Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <ScrollRevealCard delay={0.1} direction="up">
                            <Card className="h-full">
                                <div className="flex flex-col h-full p-6">
                                    <h2 className="text-lg font-semibold mb-2 dark:text-white">Available to Invest</h2>
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                                        ${portfolioData.availableToInvest.toLocaleString()}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Capital available for new investments
                                    </p>
                                    <div className="mt-auto">
                                        <Button
                                            onClick={() => setActiveTab('invest')}
                                            variant="primary"
                                            size="sm"
                                        >
                                            Invest Now
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </ScrollRevealCard>

                        <ScrollRevealCard delay={0.2} direction="up">
                            <Card className="h-full">
                                <div className="flex flex-col h-full p-6">
                                    <h2 className="text-lg font-semibold mb-2 dark:text-white">Available to Re-Invest</h2>
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                                        ${portfolioData.availableToReinvest.toLocaleString()}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Rental income available for re-investment
                                    </p>
                                    <div className="mt-auto">
                                        <Button
                                            onClick={() => setActiveTab('reinvest')}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Re-Invest
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </ScrollRevealCard>

                        <ScrollRevealCard delay={0.3} direction="up">
                            <Card className="h-full">
                                <div className="flex flex-col h-full p-6">
                                    <h2 className="text-lg font-semibold mb-2 dark:text-white">Forecasted Yield</h2>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-3">
                                        {(portfolioData.forecastedYield * 100).toFixed(1)}%
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Projected annual return on your investment strategy.
                                    </p>
                                    <div className="mt-auto">
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {(portfolioData.euribor3M * 100).toFixed(2)}% above Euribor 3M
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </ScrollRevealCard>
                    </div>

                    {/* 3D Visualization */}
                    <div className="mb-12">
                        <Card>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4 dark:text-white">Rent Collection Visualization</h2>
                                <RentGauge3D
                                    monthlyRent={portfolioData.monthlyRentIn}
                                    targetAmount={portfolioData.monthlyRentIn * 1.2}
                                    height={400}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Market Indicators Section */}
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Market Indicators</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ScrollRevealCard delay={0.1} direction="right">
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-2 dark:text-white">Euribor 3M</h3>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {(portfolioData.euribor3M * 100).toFixed(2)}%
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Current 3-month Euribor rate, a key indicator for short-term interest rates.
                                        </p>
                                    </div>
                                </Card>
                            </ScrollRevealCard>

                            <ScrollRevealCard delay={0.2} direction="right">
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-2 dark:text-white">German CPI</h3>
                                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {(portfolioData.germanCPI * 100).toFixed(2)}%
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Current German Consumer Price Index, a measure of inflation.
                                        </p>
                                    </div>
                                </Card>
                            </ScrollRevealCard>

                            <ScrollRevealCard delay={0.3} direction="right">
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-2 dark:text-white">CAGR Projection</h3>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {(portfolioData.cagrProjection * 100).toFixed(2)}%
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Compound Annual Growth Rate projection for your portfolio.
                                        </p>
                                    </div>
                                </Card>
                            </ScrollRevealCard>
                        </div>
                    </div>

                    {/* 3-Year Projection Chart */}
                    <div className="mb-12">
                        <Card>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4 dark:text-white">3-Year Projection</h2>
                                <div className="h-[300px] flex items-end space-x-12 p-4">
                                    {portfolioData.threeYearProjection.map((yearData, index) => (
                                        <div key={yearData.year} className="flex flex-col items-center flex-1">
                                            <div
                                                className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-md"
                                                style={{
                                                    height: `${(yearData.amount / portfolioData.threeYearProjection[portfolioData.threeYearProjection.length - 1].amount) * 200}px`
                                                }}
                                            ></div>
                                            <div className="mt-2 text-center">
                                                <div className="font-bold dark:text-white">{yearData.year}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">${yearData.amount.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Invest Now Tab */}
            {activeTab === 'invest' && (
                <div>
                    {step === 1 && (
                        <div className="mb-8">
                            <Card>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-6 dark:text-white">Select Your Risk Profile</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <button
                                            onClick={() => setRiskProfile('conservative')}
                                            className={`p-6 border rounded-lg text-left transition-all ${riskProfile === 'conservative'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                                : 'border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800'
                                                }`}
                                        >
                                            <h3 className="text-lg font-medium mb-2 dark:text-white">Conservative</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Lower risk investments with stable but modest returns. Focused on capital preservation.
                                            </p>
                                        </button>

                                        <button
                                            onClick={() => setRiskProfile('moderate')}
                                            className={`p-6 border rounded-lg text-left transition-all ${riskProfile === 'moderate'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                                : 'border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800'
                                                }`}
                                        >
                                            <h3 className="text-lg font-medium mb-2 dark:text-white">Moderate</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Balanced approach with a mix of growth and income investments.
                                            </p>
                                        </button>

                                        <button
                                            onClick={() => setRiskProfile('aggressive')}
                                            className={`p-6 border rounded-lg text-left transition-all ${riskProfile === 'aggressive'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                                : 'border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800'
                                                }`}
                                        >
                                            <h3 className="text-lg font-medium mb-2 dark:text-white">Aggressive</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Higher risk investments with potential for significant returns but also greater volatility.
                                            </p>
                                        </button>
                                    </div>

                                    <h2 className="text-xl font-semibold mt-12 mb-6 dark:text-white">Investment Suggestions</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {investmentSuggestions.map((investment, index) => (
                                            <ScrollRevealCard key={investment.name} delay={index * 0.1} direction="up">
                                                <Card>
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-lg font-semibold mb-2 dark:text-white">{investment.name}</h3>
                                                                <div className="flex space-x-2 mb-3">
                                                                    <Badge>{investment.type}</Badge>
                                                                    <Badge variant={getRiskBadgeVariant(investment.risk)}>{investment.risk} Risk</Badge>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{investment.expectedReturn}</div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">Expected Return</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-6">{investment.description}</p>
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">Minimum</div>
                                                                <div className="font-medium dark:text-white">{investment.minimumInvestment}</div>
                                                            </div>
                                                            <Button
                                                                onClick={() => handleInvestNow(investment, investmentSource)}
                                                                variant="primary"
                                                                size="sm"
                                                            >
                                                                Invest Now
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </ScrollRevealCard>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {step === 2 && selectedInvestment && (
                        <div className="mb-8">
                            <Card>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-6 dark:text-white">Invest in {selectedInvestment.name}</h2>

                                    <div className="mb-6">
                                        <h3 className="text-md font-medium mb-2 dark:text-white">Investment Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Investment Type</div>
                                                <div className="font-medium dark:text-white">{selectedInvestment.type}</div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Risk Level</div>
                                                <div className="font-medium dark:text-white">{selectedInvestment.risk}</div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Expected Return</div>
                                                <div className="font-medium dark:text-white">{selectedInvestment.expectedReturn}</div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Minimum Investment</div>
                                                <div className="font-medium dark:text-white">{selectedInvestment.minimumInvestment}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-md font-medium mb-2 dark:text-white">
                                            Investment Amount ({investmentSource === 'new' ? 'New Capital' : 'Re-Investment'})
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                value={investmentAmount}
                                                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
                                                max={investmentSource === 'new' ? portfolioData.availableToInvest : portfolioData.availableToReinvest}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                                            Available: ${(investmentSource === 'new' ? portfolioData.availableToInvest : portfolioData.availableToReinvest).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-8">
                                        <Button onClick={handlePrevStep} variant="secondary">
                                            Back
                                        </Button>
                                        <Button onClick={handleConfirmInvestment} variant="primary">
                                            Confirm Investment
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {step === 3 && selectedInvestment && (
                        <div className="mb-8">
                            <Card>
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2 dark:text-white">Investment Successful!</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        You have successfully invested ${investmentAmount.toLocaleString()} in {selectedInvestment.name}.
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        <Button onClick={() => { setActiveTab('dashboard'); setStep(1); }} variant="primary">
                                            Return to Dashboard
                                        </Button>
                                        <Button onClick={() => { setStep(1); }} variant="secondary">
                                            Make Another Investment
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {/* Re-Investment Tab */}
            {activeTab === 'reinvest' && (
                <div>
                    <div className="mb-8">
                        <ParallaxBalanceTicker
                            balance={portfolioData.monthlyRentIn}
                            label="Monthly Rental Income"
                            height={200}
                        />
                    </div>

                    <div className="mb-8">
                        <Card>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold dark:text-white">Re-Investment Dashboard</h2>
                                    <Badge variant="info">API-Driven Suggestions</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent Income</div>
                                        <div className="text-xl font-medium dark:text-white">${portfolioData.monthlyRentIn.toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Allocated to Reserve</div>
                                        <div className="text-xl font-medium dark:text-white">{(portfolioData.allocatedReservePercentage * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Available for Re-Investment</div>
                                        <div className="text-xl font-medium text-green-600 dark:text-green-400">${portfolioData.availableToReinvest.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* API-Connected Portfolio Recommendation */}
                                {portfolioRecommendation && (
                                    <div className="mb-8 border-2 border-blue-500/20 dark:border-blue-700/30 rounded-lg p-5">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium dark:text-white flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                </svg>
                                                AI-Powered Recommendation
                                            </h3>
                                            <Badge variant="info">Based on Rental Income</Badge>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 mb-5">
                                            Based on your monthly rent collection of ${portfolioData.monthlyRentIn.toLocaleString()},
                                            our AI recommends a {riskProfile} portfolio with the following allocation:
                                        </p>

                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg mb-5">
                                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Recommended Investment</div>
                                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                        ${portfolioRecommendation.recommendedAmount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Risk Profile</div>
                                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                                                        {riskProfile}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Expected Return</div>
                                                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                                        {(portfolioData.forecastedYield * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recommended Allocation</h4>
                                                <div className="h-8 w-full rounded-md overflow-hidden flex">
                                                    {portfolioRecommendation.suggestedInvestments.map((item, index) => {
                                                        // Generate a color based on type
                                                        let bgColor = "bg-blue-500";
                                                        if (item.investment.type.includes('Bond')) bgColor = "bg-green-500";
                                                        if (item.investment.type.includes('REIT')) bgColor = "bg-purple-500";
                                                        if (item.investment.risk === 'High') bgColor = "bg-amber-500";

                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`${bgColor} h-full`}
                                                                style={{ width: `${item.percentage * 100}%` }}
                                                                title={`${item.investment.name}: ${(item.percentage * 100).toFixed(1)}%`}
                                                            ></div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex flex-wrap gap-3 mt-3">
                                                    {portfolioRecommendation.suggestedInvestments.map((item, index) => {
                                                        // Generate a color based on type
                                                        let bgColor = "bg-blue-500";
                                                        let textColor = "text-blue-500";
                                                        if (item.investment.type.includes('Bond')) {
                                                            bgColor = "bg-green-500";
                                                            textColor = "text-green-500";
                                                        }
                                                        if (item.investment.type.includes('REIT')) {
                                                            bgColor = "bg-purple-500";
                                                            textColor = "text-purple-500";
                                                        }
                                                        if (item.investment.risk === 'High') {
                                                            bgColor = "bg-amber-500";
                                                            textColor = "text-amber-500";
                                                        }

                                                        return (
                                                            <div key={index} className="flex items-center text-xs">
                                                                <div className={`w-3 h-3 ${bgColor} rounded-sm mr-1`}></div>
                                                                <span className={`${textColor} font-medium`}>
                                                                    {item.investment.name.split(' ')[0]} ({(item.percentage * 100).toFixed(1)}%)
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <Button
                                                onClick={() => setActiveTab('dashboard')}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                onClick={handleAcceptOptimizedPortfolio}
                                                variant="primary"
                                                size="sm"
                                            >
                                                Implement Recommendation
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* 3D Visualization */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium mb-4 dark:text-white">Rent Collection Visualization</h3>
                                    <RentGauge3D
                                        monthlyRent={portfolioData.monthlyRentIn}
                                        targetAmount={portfolioData.monthlyRentIn * 1.2}
                                        height={350}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-medium mb-4 dark:text-white">Individual Re-Investment Options</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        You can also select individual investment options for your rental income.
                                        These options are filtered based on your selected risk profile.
                                    </p>
                                </div>

                                {/* Risk Profile Selector for Individual Investments */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <Button
                                        onClick={() => setRiskProfile('conservative')}
                                        variant={riskProfile === 'conservative' ? 'primary' : 'secondary'}
                                        size="sm"
                                    >
                                        Conservative
                                    </Button>
                                    <Button
                                        onClick={() => setRiskProfile('moderate')}
                                        variant={riskProfile === 'moderate' ? 'primary' : 'secondary'}
                                        size="sm"
                                    >
                                        Moderate
                                    </Button>
                                    <Button
                                        onClick={() => setRiskProfile('aggressive')}
                                        variant={riskProfile === 'aggressive' ? 'primary' : 'secondary'}
                                        size="sm"
                                    >
                                        Aggressive
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {investmentSuggestions.slice(0, 4).map((investment, index) => (
                                        <ScrollRevealCard key={investment.name} delay={index * 0.1} direction="up">
                                            <Card>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-md font-semibold mb-2 dark:text-white">{investment.name}</h3>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                <Badge>{investment.type}</Badge>
                                                                <Badge variant={getRiskBadgeVariant(investment.risk)}>{investment.risk} Risk</Badge>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-md font-bold text-blue-600 dark:text-blue-400">{investment.expectedReturn}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Expected Return</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end mt-4">
                                                        <Button
                                                            onClick={() => {
                                                                setInvestmentSource('reinvest');
                                                                handleInvestNow(investment, 'reinvest');
                                                            }}
                                                            variant="primary"
                                                            size="sm"
                                                        >
                                                            Re-Invest Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </ScrollRevealCard>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}