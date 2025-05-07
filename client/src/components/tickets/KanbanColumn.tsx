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
  onViewTicket: (ticket: Ticket) => void;
  icon?: React.ReactNode;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tickets,
  columnId,
  onViewTicket,
  icon
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${columnId}`,
    data: {
      columnId: columnId,
      accepts: ['ticket']
    }
  });

  const ticketIds = tickets.map(ticket => ticket.id.toString());

  return (
    <motion.div
      ref={setNodeRef}
      data-column={columnId}
      animate={isOver ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <div className="flex-none">
          <div className="font-semibold flex justify-between items-center px-4 py-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              {icon}
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
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[150px] flex items-center justify-center border-2 border-dashed rounded-lg bg-background/40 border-border/50 text-muted-foreground">
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm">No tickets</p>
                  </div>
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