import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanItem from './KanbanItem';
import { Ticket } from '@/types/api/tickets.types';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import AnimatedText from '@/components/common/AnimatedText';

type KanbanColumnProps = {
  title: string;
  tickets: Ticket[];
  columnId: string;
  color: string;
  titleColor?: string;
  iconClass?: string;
  isActive?: boolean;
  isDraggedOver?: boolean;
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onStatusChange: (ticketId: number, newStatus: string) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tickets,
  columnId,
  color,
  titleColor = 'text-foreground',
  iconClass = 'text-muted-foreground',
  isActive = false,
  isDraggedOver = false,
  onViewTicket,
  onEditTicket,
  onStatusChange
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${columnId}`,
    data: {
      columnId: columnId,
      accepts: ['ticket']
    }
  });

  // Combine the props isDraggedOver with the internal isOver state
  const isCurrentlyOver = isDraggedOver || isOver;

  const ticketIds = tickets.map(ticket => ticket.id.toString());

  // Choose the appropriate icon based on column type
  const getColumnIcon = () => {
    switch (columnId) {
      case 'urgent':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
          </svg>
        );
      case 'high':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'normal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get column styling based on type
  const getBorderColor = () => {
    switch (columnId) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'normal':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Generate column animation states
  const getDroppableStyles = () => {
    const columnColor =
      columnId === 'urgent' ? 'var(--destructive)' :
        columnId === 'high' ? 'var(--amber-500)' :
          'var(--primary)';

    if (isCurrentlyOver) {
      return {
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.12)',
        backgroundColor:
          columnId === 'urgent' ? 'rgba(var(--destructive-rgb), 0.04)' :
            columnId === 'high' ? 'rgba(245, 158, 11, 0.04)' :
              'rgba(var(--primary-rgb), 0.04)',
      };
    }

    if (isActive) {
      return {
        opacity: 0.85,
      };
    }

    return {};
  };

  return (
    <motion.div
      ref={setNodeRef}
      data-column={columnId}
      animate={isActive || isCurrentlyOver ? { scale: isCurrentlyOver ? 1.01 : 1 } : {}}
      transition={{ duration: 0.2 }}
      style={getDroppableStyles()}
      className="h-full"
    >
      <Card
        className={`h-full flex flex-col transition-all duration-200 ${isCurrentlyOver ? 'border-2' : ''}`}
        borderColor={getBorderColor()}
      >
        <div className="flex-none">
          <div className={`font-semibold flex justify-between items-center px-4 py-3 border-b border-border/30 ${titleColor}`}>
            <div className="flex items-center gap-2">
              <span className={`${iconClass}`}>{getColumnIcon()}</span>
              <AnimatedText
                text={title}
                animation="slide-up"
                once={false}
                delay={0.1}
                className="font-medium"
              />
            </div>
            <span className="text-sm font-normal bg-background/90 rounded-full px-2.5 py-0.5 text-muted-foreground">
              {tickets.length}
            </span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-3 space-y-2 h-full">
          <SortableContext items={ticketIds} strategy={verticalListSortingStrategy}>
            {tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <KanbanItem
                      ticket={ticket}
                      onViewTicket={onViewTicket}
                      onEditTicket={onEditTicket}
                      onStatusChange={onStatusChange}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`h-full min-h-[150px] flex items-center justify-center border-2 border-dashed rounded-lg
                ${isCurrentlyOver
                  ? columnId === 'urgent'
                    ? 'bg-background/60 border-destructive/30 text-destructive/70'
                    : columnId === 'high'
                      ? 'bg-background/60 border-amber-500/30 text-amber-600/70'
                      : 'bg-background/60 border-primary/30 text-primary/70'
                  : 'bg-background/40 border-border/50 text-muted-foreground'}`}>
                <div className="text-center">
                  {isCurrentlyOver ? (
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium">Drop ticket here</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm">No tickets</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </SortableContext>
        </div>
      </Card>
    </motion.div>
  );
};

export default KanbanColumn;