import React from 'react';
import { TicketStatus } from '@/types/api/tickets.types';
import { getStatusVariant } from './ticket-utils';
import Badge from '@/components/ui/Badge';

type TicketFilterTabsProps = {
  activeStatus?: TicketStatus;
  onFilterChange: (status: string) => void;
};

const TicketFilterTabs: React.FC<TicketFilterTabsProps> = ({
  activeStatus,
  onFilterChange,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Tickets' },
    { value: 'in_progress_by_ai', label: 'In Progress by AI' },
    { value: 'needs_manual_review', label: 'Needs Manual Review' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="flex flex-col space-y-2 mb-6">
      <div className="text-sm font-medium text-muted-foreground mb-1">Filter by status</div>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeStatus === option.value || 
              (option.value === 'all' && !activeStatus)
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-foreground hover:bg-muted'
            }`}
          >
            {option.value !== 'all' && (
              <Badge 
                variant={getStatusVariant(option.value)} 
                className="mr-2 px-1 py-0 text-[10px]"
              >
                {option.value === 'in_progress_by_ai' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-0.5 mr-1 h-2 w-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI
                  </span>
                ) : option.value === 'needs_manual_review' ? '!' : '✓'}
              </Badge>
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicketFilterTabs;