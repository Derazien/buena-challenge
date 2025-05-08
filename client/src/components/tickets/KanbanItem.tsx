import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket } from '@/types/api/tickets.types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { getPriorityVariant, getStatusVariant } from './ticket-utils';

type KanbanItemProps = {
  ticket: Ticket;
  onViewTicket: (ticket: Ticket) => void;
};

const KanbanItem: React.FC<KanbanItemProps> = ({
  ticket,
  onViewTicket
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

  const formattedDate = formatDate(ticket.createdAt);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress_by_ai':
        return 'bg-indigo-500';
      case 'needs_manual_review':
        return 'bg-amber-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
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
        ${ticket.status === 'in_progress_by_ai' ? 'relative overflow-hidden' : ''}
      `}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation();
          onViewTicket(ticket);
        }
      }}
      data-dragging={isDragging ? 'true' : 'false'}
      {...attributes}
      {...listeners}
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
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <h4 className="font-medium text-foreground truncate max-w-[85%] flex items-center">
          {ticket.status === 'in_progress_by_ai' && (
            <svg className="animate-spin h-3 w-3 mr-2 text-primary inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {ticket.title}
        </h4>
        <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`}></div>
      </div>

      {!isDragging && (
        <>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {ticket.description}
          </p>

          <div className="flex justify-between items-center mt-3 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
              <Badge variant={getPriorityVariant(ticket.priority)} className="text-[10px] px-1 py-0">
                {ticket.priority}
              </Badge>
            </div>
            
            {ticket.metadata?.aiProcessed && (
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                AI
              </Badge>
            )}
          </div>
        </>
      )}

      {isDragging && (
        <div className="flex items-center justify-center py-2">
          <span className="text-xs font-medium text-muted-foreground">Moving to new status...</span>
        </div>
      )}
    </motion.div>
  );
};

export default KanbanItem;