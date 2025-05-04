import React from 'react';
import { format } from 'date-fns';
import { Ticket } from '@/types/api/tickets.types';
import Card from '@/components/ui/Card';

type TicketListProps = {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
};

const TicketList: React.FC<TicketListProps> = ({ tickets, onViewTicket, onEditTicket }) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-amber-100 text-amber-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (tickets.length === 0) {
    return (
      <Card>
        <div className="py-12 flex flex-col items-center justify-center">
          <svg
            className="h-12 w-12 text-gray-400 mb-4"
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
          <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No tickets match your current filters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => onViewTicket(ticket)}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status.toLowerCase().replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Property: {ticket.propertyAddress}</span>
                <span>{ticket.createdAt ? format(new Date(ticket.createdAt), 'MMM d, yyyy') : ''}</span>
              </div>
            </div>
            <div className="ml-4 flex flex-col">
              <button
                onClick={() => onEditTicket(ticket)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;