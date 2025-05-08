import React from 'react';
import { format } from 'date-fns';
import { Ticket } from '@/types/api/tickets.types';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/common/AnimatedText';
import AnimatedCard from '@/components/common/AnimatedCard';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from '@/components/ui/table';
import Badge from '@/components/ui/Badge';
import { getPriorityVariant, getStatusVariant } from '@/components/tickets/ticket-utils';
import { formatDate } from '@/lib/format';

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

  const getAIStatusBadge = (ticket: Ticket) => {
    if (!ticket.metadata) return null;
    
    if (ticket.status === 'in_progress_by_ai') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
          <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          AI Processing
        </Badge>
      );
    }
    
    if (ticket.metadata.aiProcessed) {
      return <Badge variant="success">AI Processed</Badge>;
    }
    
    if (ticket.metadata.useAI) {
      return <Badge variant="secondary">AI Enabled</Badge>;
    }
    
    return null;
  };

  const getTicketInfo = (ticket: Ticket) => {
    if (!ticket.metadata) return null;

    if (ticket.status === 'needs_manual_review' && ticket.metadata.manualReviewReason) {
      return (
        <div className="text-xs text-amber-600 mt-1">
          <span className="font-semibold">Needs Review:</span> {ticket.metadata.manualReviewReason}
        </div>
      );
    }
    
    if (ticket.status === 'resolved' && ticket.metadata.aiResolution) {
      return (
        <div className="text-xs text-emerald-600 mt-1">
          <span className="font-semibold">Resolution:</span> {ticket.metadata.aiResolution}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              onClick={() => onViewTicket(ticket)}
              className={`cursor-pointer hover:bg-muted/50 ${
                ticket.status === 'in_progress_by_ai' ? 'relative overflow-hidden' : ''
              }`}
            >
              {ticket.status === 'in_progress_by_ai' && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 z-0" 
                  animate={{ 
                    x: ['0%', '100%', '0%'],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "linear"
                  }}
                />
              )}
              <TableCell className="font-medium relative z-10">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {ticket.status === 'in_progress_by_ai' && (
                      <svg className="animate-spin h-3 w-3 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{ticket.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {ticket.description}
                  </span>
                  {ticket.metadata?.generatedByAI && (
                    <Badge variant="outline" className="mt-1 w-fit">Generated by AI</Badge>
                  )}
                  {getTicketInfo(ticket)}
                </div>
              </TableCell>
              <TableCell className="relative z-10">
                <div className="flex flex-col gap-1">
                  <Badge variant={getStatusVariant(ticket.status)}>
                    {ticket.status === 'in_progress_by_ai' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-0.5 mr-1 h-2 w-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    ) : (
                      ticket.status.replace(/_/g, ' ')
                    )}
                  </Badge>
                  {getAIStatusBadge(ticket)}
                </div>
              </TableCell>
              <TableCell className="relative z-10">
                <Badge variant={getPriorityVariant(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell className="relative z-10">{ticket.propertyAddress}</TableCell>
              <TableCell className="text-muted-foreground relative z-10">
                {formatDate(ticket.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketList;