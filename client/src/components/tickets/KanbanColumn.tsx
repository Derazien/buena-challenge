import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanItem from './KanbanItem';
import { Ticket } from '@/types/api/tickets.types';

type KanbanColumnProps = {
  title: string;
  tickets: Ticket[];
  columnId: string;
  color: string;
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onStatusChange: (ticketId: number, newStatus: string) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tickets,
  columnId,
  color,
  onViewTicket,
  onEditTicket,
  onStatusChange
}) => {
  const { setNodeRef } = useDroppable({
    id: `droppable-${columnId}`,
  });

  const ticketIds = tickets.map(ticket => ticket.id.toString());

  return (
    <div 
      ref={setNodeRef}
      data-column={columnId}
      className={`${color} border rounded-lg shadow-sm p-4 h-full flex flex-col`}
    >
      <h3 className="font-semibold text-lg mb-4 flex justify-between">
        <span>{title}</span>
        <span className="text-sm font-normal bg-white rounded-full px-2 py-0.5 text-gray-600">
          {tickets.length}
        </span>
      </h3>
      
      <div className="flex-grow overflow-y-auto">
        <SortableContext items={ticketIds} strategy={verticalListSortingStrategy}>
          {tickets.length > 0 ? (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <KanbanItem
                  key={ticket.id}
                  ticket={ticket}
                  onViewTicket={onViewTicket}
                  onEditTicket={onEditTicket}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center border border-dashed rounded-lg bg-white bg-opacity-50">
              <p className="text-sm text-gray-500">No tickets</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn; 