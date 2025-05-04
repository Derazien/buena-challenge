import React from 'react';
import { TicketStatus } from '@/types/api/tickets.types';
import { cn } from '@/lib/utils';

interface TicketFilterTabsProps {
    activeStatus?: TicketStatus;
    onFilterChange: (status: string) => void;
}

/**
 * Component for ticket status filter tabs
 */
const TicketFilterTabs: React.FC<TicketFilterTabsProps> = ({
    activeStatus,
    onFilterChange
}) => {
    return (
        <div className="mb-6 border-b border-border">
            <nav className="flex -mb-px space-x-8">
                <FilterTabButton
                    label="All"
                    isActive={activeStatus === undefined}
                    onClick={() => onFilterChange('all')}
                />
                <FilterTabButton
                    label="Open"
                    isActive={activeStatus === 'open'}
                    onClick={() => onFilterChange('open')}
                />
                <FilterTabButton
                    label="In Progress"
                    isActive={activeStatus === 'in_progress'}
                    onClick={() => onFilterChange('in_progress')}
                />
                <FilterTabButton
                    label="Resolved"
                    isActive={activeStatus === 'resolved'}
                    onClick={() => onFilterChange('resolved')}
                />
            </nav>
        </div>
    );
};

interface FilterTabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

/**
 * Individual tab button component
 */
const FilterTabButton: React.FC<FilterTabButtonProps> = ({
    label,
    isActive,
    onClick
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default browser action
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            type="button" // Explicitly set button type to avoid form submission behavior
            className={cn(
                "pb-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200",
                isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
        >
            {label}
        </button>
    );
};

export default TicketFilterTabs;