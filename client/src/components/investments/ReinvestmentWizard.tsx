import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PORTFOLIO_SUMMARY, ALLOCATE_FUNDS } from '@/graphql/portfolio.operations';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Confetti with no SSR
const Confetti = dynamic(() => import('react-confetti'), {
    ssr: false
});

interface ReinvestmentWizardProps {
    onComplete: () => void;
}

interface RiskCardProps {
    profile: string;
    isSelected: boolean;
    onClick: () => void;
}

const RiskCard: React.FC<RiskCardProps> = ({ profile, isSelected, onClick }) => (
    <div
        className={`p-4 cursor-pointer transition-all rounded-lg border ${
            isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
        }`}
        onClick={onClick}
    >
        <h4 className="font-medium mb-2">{profile}</h4>
        <p className="text-sm text-muted-foreground">
            {profile === 'Conservative' && 'Lower risk, stable returns'}
            {profile === 'Moderate' && 'Balanced risk and return'}
            {profile === 'Aggressive' && 'Higher risk, potential for higher returns'}
        </p>
    </div>
);

export const ReinvestmentWizard: React.FC<ReinvestmentWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [riskProfile, setRiskProfile] = useState('moderate');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const { data: portfolioData } = useQuery(GET_PORTFOLIO_SUMMARY);
    const [allocateFunds] = useMutation(ALLOCATE_FUNDS);

    const availableToReinvest = portfolioData?.portfolioSummary?.availableToReinvest || 0;

    React.useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    const handleReinvest = async () => {
        if (!availableToReinvest) return;

        setIsLoading(true);
        try {
            const result = await allocateFunds({
                variables: {
                    input: {
                        amount: availableToReinvest,
                        riskProfile,
                        investmentId: `auto-${Date.now()}`
                    }
                }
            });

            if (result.data.allocateFunds.success) {
                setShowConfetti(true);
                setTimeout(() => {
                    setShowConfetti(false);
                    onComplete();
                }, 3000);
            }
        } catch (error) {
            console.error('Error allocating funds:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}
            <Card className="p-6 max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-lg font-medium mb-2">Available to Reinvest</h3>
                                <p className="text-2xl font-bold mb-4">€{availableToReinvest.toLocaleString()}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-4">Select Risk Profile</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Conservative', 'Moderate', 'Aggressive'].map((profile) => (
                                        <RiskCard
                                            key={profile}
                                            profile={profile}
                                            isSelected={riskProfile.toLowerCase() === profile.toLowerCase()}
                                            onClick={() => setRiskProfile(profile.toLowerCase())}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={onComplete}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={isLoading || !availableToReinvest}
                                >
                                    Next
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-lg font-medium mb-4">Confirm Reinvestment</h3>
                                <div className="bg-muted/10 p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Amount:</span>
                                        <span className="text-sm font-medium">€{availableToReinvest.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Risk Profile:</span>
                                        <span className="text-sm font-medium capitalize">{riskProfile}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Expected Return:</span>
                                        <span className="text-sm font-medium">
                                            {riskProfile === 'conservative' && '3-6% annually'}
                                            {riskProfile === 'moderate' && '5-9% annually'}
                                            {riskProfile === 'aggressive' && '8-14% annually'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleReinvest}
                                    disabled={isLoading || !availableToReinvest}
                                >
                                    {isLoading ? 'Processing...' : 'Confirm Reinvestment'}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </>
    );
}; 