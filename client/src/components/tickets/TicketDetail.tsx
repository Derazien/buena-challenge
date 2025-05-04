import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Ticket, TicketStatus } from '@/types/api/tickets.types';

interface TicketDetailProps {
    ticket: Ticket;
    onEdit: () => void;
    onStatusChange: (status: TicketStatus) => void;
    onBack: () => void;
}

/**
 * Helper to get badge variant based on priority
 */
const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'high':
        case 'urgent':
            return 'danger';
        case 'medium':
            return 'warning';
        case 'low':
            return 'info';
        default:
            return 'default';
    }
};

/**
 * Helper to get badge variant based on status
 */
const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'open':
            return 'danger';
        case 'in_progress':
            return 'warning';
        case 'pending':
            return 'info';
        case 'resolved':
        case 'closed':
            return 'success';
        default:
            return 'default';
    }
};

/**
 * Component to display detailed view of a ticket
 */
const TicketDetail: React.FC<TicketDetailProps> = ({
    ticket,
    onEdit,
    onStatusChange,
    onBack
}) => {
    return (
        <Card>
            <div className="mb-4 flex justify-between items-center">
                <button onClick={onBack} className="text-blue-500 hover:underline flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Back to Tickets
                </button>
                <Badge variant={getPriorityVariant(ticket.priority)}>
                    {ticket.priority}
                </Badge>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">{ticket.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
                <Badge variant={getStatusVariant(ticket.status)}>
                    {ticket.status}
                </Badge>
                <span className="text-sm text-gray-500">
                    Created {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div className="mb-8">
                <h3 className="text-sm uppercase text-gray-600 font-medium mb-2">
                    Property
                </h3>
                <p className="text-gray-800">{ticket.propertyAddress}</p>
            </div>

            <div className="mb-8">
                <h3 className="text-sm uppercase text-gray-600 font-medium mb-2">
                    Description
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-sm uppercase text-gray-600 font-medium mb-4">
                    Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={onEdit}>
                        Edit Ticket
                    </Button>
                    <div className="relative">
                        <Button className="w-full flex justify-between items-center">
                            Update Status
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <select
                                className="w-full h-full absolute opacity-0 cursor-pointer"
                                value={ticket.status}
                                onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TicketDetail;