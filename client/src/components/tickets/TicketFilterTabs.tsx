import React from 'react';
import { TicketStatus } from '@/types/api/tickets.types';

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
        <div className="mb-6 border-b border-gray-200">
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
    return (
        <button
            onClick={onClick}
            className={`pb-3 px-1 font-medium text-sm border-b-2 ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    );
};

export default TicketFilterTabs;