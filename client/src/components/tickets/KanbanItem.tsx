import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket, TicketStatus } from '@/types/api/tickets.types';
import { format } from 'date-fns';

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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResolveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(ticket.id, 'RESOLVED');
  };

  const formattedDate = ticket.createdAt 
    ? format(new Date(ticket.createdAt), 'MMM d, yyyy')
    : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-md shadow-sm p-3 cursor-grab active:cursor-grabbing
        border border-gray-200 hover:border-gray-300 transition-colors
      `}
      onClick={() => onViewTicket(ticket)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 truncate">{ticket.title}</h4>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEditTicket(ticket);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 rounded-full ${getStatusColor(ticket.status)}`}>
            {ticket.status.toLowerCase().replace('_', ' ')}
          </span>
          <span className="text-gray-500">{formattedDate}</span>
        </div>

        {ticket.status.toLowerCase() !== 'resolved' && (
          <button
            onClick={handleResolveClick}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanItem; 