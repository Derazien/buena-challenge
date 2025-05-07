import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket } from '@/types/api/tickets.types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress_by_ai':
        return 'info';
      case 'under_review':
        return 'secondary';
      case 'pending_approval':
        return 'destructive';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formattedDate = format(new Date(ticket.createdAt), 'MMM d, yyyy');

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
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-foreground truncate max-w-[85%]">{ticket.title}</h4>
      </div>

      {!isDragging && (
        <>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {ticket.description}
          </p>

          <div className="flex justify-between items-center mt-3">
            <Badge variant={getStatusBadgeVariant(ticket.status)}>
              {ticket.status.toLowerCase().replace(/_/g, ' ')}
            </Badge>
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
          <span className="text-xs font-medium text-muted-foreground">Moving to new status...</span>
        </div>
      )}
    </motion.div>
  );
};

export default KanbanItem;