import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket, TicketStatus } from '@/types/api/tickets.types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';

type KanbanItemProps = {
  ticket: Ticket;
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onStatusChange: (ticketId: number, newStatus: string) => void;
};

const KanbanItem: React.FC<KanbanItemProps> = ({
  ticket,
  onViewTicket,
  onEditTicket,
  onStatusChange
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: ticket.id.toString(),
    data: {
      type: 'ticket',
      ticket
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'danger';
      case 'in_progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
      case 'normal':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
          </svg>
        );
      case 'high':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const handleResolveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(ticket.id, 'RESOLVED' as TicketStatus);
  };

  const formattedDate = ticket.createdAt
    ? format(new Date(ticket.createdAt), 'MMM d, yyyy')
    : '';

  const handleTouchStart = (e: React.TouchEvent) => {
    setTimeout(() => {
      if (listeners?.onTouchStart) {
        listeners.onTouchStart(e);
      }
    }, 100);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ scale: 1.01 }}
      className={`
        p-4 rounded-lg border shadow-sm
        bg-card text-card-foreground
        cursor-grab active:cursor-grabbing
        ${isDragging
          ? 'shadow-md opacity-90 rotate-1 scale-105'
          : 'hover:shadow-md hover:border-border/80'}
        transition-all duration-200 touch-manipulation
        bg-gradient-to-r from-card to-background/80
      `}
      onClick={() => !isDragging && onViewTicket(ticket)}
      data-dragging={isDragging ? 'true' : 'false'}
      onTouchStart={handleTouchStart}
      {...attributes}
      {...(listeners || {})}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-foreground truncate max-w-[85%]">{ticket.title}</h4>
        {!isDragging && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTicket(ticket);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
      </div>

      {!isDragging && (
        <>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {ticket.description}
          </p>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(ticket.status)}>
                {ticket.status.toLowerCase().replace('_', ' ')}
              </Badge>
              <Badge variant={getPriorityBadgeVariant(ticket.priority)} className="flex items-center">
                {getPriorityIcon(ticket.priority)}
                {ticket.priority}
              </Badge>
            </div>

            {ticket.status.toLowerCase() !== 'resolved' && (
              <button
                onClick={handleResolveClick}
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center text-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Resolve
              </button>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {formattedDate}
          </div>
        </>
      )}

      {isDragging && (
        <div className="flex items-center justify-center py-2">
          <span className="text-xs font-medium text-muted-foreground">Moving to new priority...</span>
        </div>
      )}
    </motion.div>
  );
};

export default KanbanItem;