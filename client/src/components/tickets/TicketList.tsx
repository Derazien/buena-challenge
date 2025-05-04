import React from 'react';
import { format } from 'date-fns';
import { Ticket } from '@/types/api/tickets.types';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/common/AnimatedText';
import AnimatedCard from '@/components/common/AnimatedCard';

type TicketListProps = {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
};

const TicketList: React.FC<TicketListProps> = ({ tickets, onViewTicket, onEditTicket }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-destructive/15 text-destructive';
      case 'in_progress':
        return 'bg-primary/15 text-primary';
      case 'pending':
        return 'bg-amber-500/15 text-amber-600';
      case 'resolved':
        return 'bg-emerald-500/15 text-emerald-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-destructive/15 text-destructive';
      case 'high':
        return 'bg-amber-500/15 text-amber-600';
      case 'medium':
        return 'bg-primary/15 text-primary';
      case 'low':
        return 'bg-emerald-500/15 text-emerald-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (tickets.length === 0) {
    return (
      <AnimatedCard className="p-8" delay={0.2}>
        <div className="py-12 flex flex-col items-center justify-center">
          <svg
            className="h-16 w-16 text-muted mb-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-medium text-foreground mb-2">No tickets found</h3>
          <p className="text-center text-muted-foreground">
            No tickets match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket, index) => (
        <motion.div
          key={ticket.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -2 }}
        >
          <AnimatedCard
            className="hover:shadow-md transition-all"
            hoverEffect="none"
            once={false}
            delay={index * 0.05}
          >
            <div className="p-5">
              <div className="flex justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => onViewTicket(ticket)}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-foreground">{ticket.title}</h3>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.toLowerCase().replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ticket.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs flex items-center text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {ticket.propertyAddress || 'No property assigned'}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {ticket.createdAt ? format(new Date(ticket.createdAt), 'MMM d, yyyy') : ''}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col">
                  <button
                    onClick={() => onEditTicket(ticket)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      ))}
    </div>
  );
};

export default TicketList;