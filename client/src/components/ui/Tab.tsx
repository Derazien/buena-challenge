'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface TabProps {
    label: string;
    value: string;
    icon?: ReactNode;
}

export interface TabsProps {
    tabs: TabProps[];
    value: string;
    onChange: (value: string) => void;
    variant?: 'default' | 'pills' | 'underline' | 'enclosed';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

type VariantType = 'default' | 'pills' | 'underline' | 'enclosed';
type SizeType = 'sm' | 'md' | 'lg';

export function Tab({ tabs, value, onChange, variant = 'default', size = 'md', fullWidth = false }: TabsProps) {
    const getTabStyle = (isActive: boolean, tabVariant: VariantType) => {
        const baseStyle = 'transition-all duration-200 inline-flex items-center';
        const cursorStyle = 'cursor-pointer';
        const sizeStyles: Record<SizeType, string> = {
            sm: 'text-sm px-3 py-1.5',
            md: 'px-4 py-2',
            lg: 'text-lg px-5 py-2.5'
        };

        const variantStyles: Record<VariantType, string> = {
            default: isActive
                ? 'border-b-2 border-primary text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted',
            pills: isActive
                ? 'bg-primary text-white rounded-full font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-full',
            underline: isActive
                ? 'border-b-2 border-primary text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground',
            enclosed: isActive
                ? 'bg-background border-t border-x rounded-t-lg -mb-px font-medium'
                : 'bg-muted/30 text-muted-foreground hover:text-foreground border-transparent border-t border-x rounded-t-lg'
        };

        return `${baseStyle} ${cursorStyle} ${sizeStyles[size as SizeType]} ${variantStyles[tabVariant]}`;
    };

    const containerStyles: Record<VariantType, string> = {
        default: 'border-b border-border',
        pills: '',
        underline: 'border-b border-border',
        enclosed: 'border-b border-border'
    };

    return (
        <div className={`${containerStyles[variant as VariantType]} ${fullWidth ? 'w-full' : ''}`}>
            <div className={`flex ${fullWidth ? 'w-full' : 'space-x-2'}`}>
                {tabs.map((tab) => (
                    <div
                        key={tab.value}
                        className={`${getTabStyle(tab.value === value, variant as VariantType)} ${fullWidth ? 'flex-1 text-center justify-center' : ''}`}
                        onClick={() => onChange(tab.value)}
                    >
                        {tab.icon && <span className="mr-2">{tab.icon}</span>}
                        <span>{tab.label}</span>
                        {tab.value === value && variant === 'default' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                layoutId="tab-indicator"
                                style={{ bottom: '-1px' }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}