'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// Define the type for investment suggestions
type Investment = {
    name: string;
    type: string;
    expectedReturn: string;
    risk: string;
    minimumInvestment: string;
    description: string;
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
    }
];

export default function ReinvestPage() {
    const [step, setStep] = useState(1);
    const [surplusCash, setSurplusCash] = useState('1000');
    const [riskProfile, setRiskProfile] = useState('moderate');
    const [suggestions, setSuggestions] = useState<Investment[]>(INVESTMENT_SUGGESTIONS);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

    const handleNextStep = () => {
        setStep(step + 1);
        // In a real implementation, we would fetch suggestions from the API based on inputs
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const getRiskBadgeVariant = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return 'default';
            case 'medium': return 'info';
            case 'medium-high': return 'warning';
            case 'high': return 'danger';
            default: return 'default';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href="/" className="text-buena-primary hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            <Card className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-buena-dark mb-6">Rent-Reinvest Wizard</h1>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className={`text-sm ${step >= 1 ? 'text-buena-primary font-medium' : 'text-buena-muted'}`}>Enter Amount</span>
                        <span className={`text-sm ${step >= 2 ? 'text-buena-primary font-medium' : 'text-buena-muted'}`}>Risk Profile</span>
                        <span className={`text-sm ${step >= 3 ? 'text-buena-primary font-medium' : 'text-buena-muted'}`}>Review & Confirm</span>
                    </div>
                    <div className="w-full bg-buena-border rounded-full h-2">
                        <div
                            className="bg-buena-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step 1: Enter Surplus Cash */}
                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold text-buena-dark mb-4">Step 1: Enter Your Surplus Cash</h2>
                        <p className="text-buena-muted mb-6">How much of your rental income would you like to reinvest?</p>

                        <div className="mb-6">
                            <label htmlFor="surplus-cash" className="block text-sm font-medium text-buena-dark mb-1">
                                Surplus Amount
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-buena-muted">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="surplus-cash"
                                    value={surplusCash}
                                    onChange={(e) => setSurplusCash(e.target.value)}
                                    className="block w-full pl-7 pr-12 py-2 border border-buena-border rounded-md focus:ring-buena-primary focus:border-buena-primary"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleNextStep}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Choose Risk Profile */}
                {step === 2 && (
                    <div>
                        <h2 className="text-xl font-semibold text-buena-dark mb-4">Step 2: Choose Your Risk Profile</h2>
                        <p className="text-buena-muted mb-6">What is your preferred level of investment risk?</p>

                        <div className="space-y-4 mb-6">
                            <label className={`flex items-center p-4 border rounded-md cursor-pointer hover:bg-buena-light transition-colors ${riskProfile === 'conservative' ? 'border-buena-primary bg-buena-light' : 'border-buena-border'}`}>
                                <input
                                    type="radio"
                                    name="risk-profile"
                                    value="conservative"
                                    checked={riskProfile === 'conservative'}
                                    onChange={() => setRiskProfile('conservative')}
                                    className="h-4 w-4 text-buena-primary focus:ring-buena-primary"
                                />
                                <div className="ml-3">
                                    <span className="block font-medium text-buena-dark">Conservative</span>
                                    <span className="block text-sm text-buena-muted">Lower risk, lower potential returns</span>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border rounded-md cursor-pointer hover:bg-buena-light transition-colors ${riskProfile === 'moderate' ? 'border-buena-primary bg-buena-light' : 'border-buena-border'}`}>
                                <input
                                    type="radio"
                                    name="risk-profile"
                                    value="moderate"
                                    checked={riskProfile === 'moderate'}
                                    onChange={() => setRiskProfile('moderate')}
                                    className="h-4 w-4 text-buena-primary focus:ring-buena-primary"
                                />
                                <div className="ml-3">
                                    <span className="block font-medium text-buena-dark">Moderate</span>
                                    <span className="block text-sm text-buena-muted">Balanced risk and potential returns</span>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border rounded-md cursor-pointer hover:bg-buena-light transition-colors ${riskProfile === 'aggressive' ? 'border-buena-primary bg-buena-light' : 'border-buena-border'}`}>
                                <input
                                    type="radio"
                                    name="risk-profile"
                                    value="aggressive"
                                    checked={riskProfile === 'aggressive'}
                                    onChange={() => setRiskProfile('aggressive')}
                                    className="h-4 w-4 text-buena-primary focus:ring-buena-primary"
                                />
                                <div className="ml-3">
                                    <span className="block font-medium text-buena-dark">Aggressive</span>
                                    <span className="block text-sm text-buena-muted">Higher risk, higher potential returns</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={handlePrevStep}
                            >
                                Back
                            </Button>
                            <Button onClick={handleNextStep}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review AI-Suggested Investments */}
                {step === 3 && (
                    <div>
                        <h2 className="text-xl font-semibold text-buena-dark mb-4">Step 3: Review AI-Suggested Investments</h2>
                        <p className="text-buena-muted mb-6">
                            Based on your ${surplusCash} surplus and {riskProfile} risk profile, here are our recommended investment options:
                        </p>

                        <div className="space-y-4 mb-8">
                            {suggestions.map((investment, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-md p-4 transition-colors cursor-pointer ${selectedInvestment === investment ? 'border-buena-primary bg-buena-light' : 'border-buena-border hover:bg-buena-light'}`}
                                    onClick={() => setSelectedInvestment(investment)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-buena-dark">{investment.name}</h3>
                                            <p className="text-sm text-buena-muted">{investment.type}</p>
                                        </div>
                                        <span className="text-buena-primary font-medium">{investment.expectedReturn}</span>
                                    </div>
                                    <p className="text-sm mt-2 text-buena-dark">{investment.description}</p>
                                    <div className="mt-2 text-sm flex justify-between items-center">
                                        <Badge variant={getRiskBadgeVariant(investment.risk)}>
                                            {investment.risk} Risk
                                        </Badge>
                                        <span className="text-buena-muted">Min: {investment.minimumInvestment}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={handlePrevStep}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => alert('Investment processed!')}
                                disabled={!selectedInvestment}
                            >
                                Invest Now
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}