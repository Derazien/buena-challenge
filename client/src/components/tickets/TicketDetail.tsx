import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Ticket, TicketStatus, TicketAttachment } from '@/types/api/tickets.types';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/common/AnimatedText';

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
    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    // Format for created date with time
    const formattedCreatedDate = new Date(ticket.createdAt).toLocaleString(undefined, dateOptions);

    // Format for due date if available
    const formattedDueDate = ticket.metadata?.dueDate
        ? new Date(ticket.metadata.dueDate).toLocaleDateString()
        : null;

    return (
        <Card className="overflow-hidden pb-6">
            <div className="bg-gradient-to-r from-primary/10 to-background p-6 border-b border-border mb-6">
                <div className="mb-4 flex justify-between items-center">
                    <button onClick={onBack} className="text-primary hover:text-primary/80 transition-colors flex items-center">
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
                    <div className="flex space-x-2">
                        <Badge variant={getPriorityVariant(ticket.priority)} className="capitalize">
                            {ticket.priority} Priority
                        </Badge>
                        <Badge variant={getStatusVariant(ticket.status)} className="capitalize">
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-2xl font-bold mb-2">
                        <AnimatedText text={ticket.title} animation="slide-up" />
                    </h1>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <span>Created {formattedCreatedDate}</span>
                        {ticket.updatedAt !== ticket.createdAt && (
                            <span className="ml-4">Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="mb-6">
                        <h3 className="text-sm uppercase text-muted-foreground font-medium mb-2">
                            Property
                        </h3>
                        <p className="text-foreground">{ticket.propertyAddress}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm uppercase text-muted-foreground font-medium mb-2">
                            Description
                        </h3>
                        <div className="text-foreground bg-muted/40 p-4 rounded-md border border-border whitespace-pre-wrap">
                            {ticket.description}
                        </div>
                    </div>

                    {ticket.metadata?.notes && (
                        <div className="mb-6">
                            <h3 className="text-sm uppercase text-muted-foreground font-medium mb-2">
                                Additional Notes
                            </h3>
                            <div className="text-foreground bg-muted/40 p-4 rounded-md border border-border whitespace-pre-wrap">
                                {ticket.metadata.notes}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="bg-background rounded-md border border-border p-5 mb-6">
                        <h3 className="text-sm uppercase text-muted-foreground font-medium mb-4">
                            Ticket Details
                        </h3>

                        <div className="space-y-3">
                            {(ticket.metadata?.contactPhone || ticket.metadata?.contactEmail) && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Contact Information</h4>
                                    <div className="text-sm grid gap-1">
                                        {ticket.metadata?.contactPhone && (
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                <span>{ticket.metadata.contactPhone}</span>
                                            </div>
                                        )}
                                        {ticket.metadata?.contactEmail && (
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <span>{ticket.metadata.contactEmail}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                {ticket.metadata?.estimatedCost && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Estimated Cost</h4>
                                        <div className="text-sm font-semibold">
                                            ${ticket.metadata.estimatedCost}
                                        </div>
                                    </div>
                                )}

                                {formattedDueDate && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Target Date</h4>
                                        <div className="text-sm">
                                            {formattedDueDate}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {ticket.metadata?.attachments && ticket.metadata.attachments.length > 0 && (
                        <div className="bg-background rounded-md border border-border p-5 mb-6">
                            <h3 className="text-sm uppercase text-muted-foreground font-medium mb-4">
                                Attachments ({ticket.metadata.attachments.length})
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {ticket.metadata.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center p-2 rounded-md border border-border bg-muted/40">
                                        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                                            {attachment.type.includes('image') ? (
                                                <img
                                                    src={attachment.url}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{attachment.filename}</p>
                                            <p className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <a
                                            href={attachment.url}
                                            download={attachment.filename}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80 p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col space-y-3">
                        <Button
                            variant="outline"
                            onClick={onEdit}
                            className="w-full justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit Ticket
                        </Button>
                        <div className="relative">
                            <Button
                                className="w-full flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                    </svg>
                                    Update Status
                                </div>
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
            </div>
        </Card>
    );
};

export default TicketDetail;