import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Ticket, TicketStatus, TicketAttachment } from '@/types/api/tickets.types';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/common/AnimatedText';
import { getStatusVariant } from './ticket-utils';

interface TicketDetailProps {
    ticket: Ticket;
    onEdit?: () => void;
    onStatusChange: (status: TicketStatus) => void;
    onClose: () => void;
}

/**
 * Helper to get badge variant based on priority
 */
const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'high':
        case 'urgent':
            return 'destructive';
        case 'medium':
            return 'warning';
        case 'low':
            return 'success';
        default:
            return 'secondary';
    }
};

/**
 * Component to display detailed view of a ticket
 */
const TicketDetail: React.FC<TicketDetailProps> = ({
    ticket,
    onEdit,
    onStatusChange,
    onClose
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
        
    // Format for AI processing time if available
    const formattedAIProcessingTime = ticket.metadata?.aiProcessingTime
        ? new Date(ticket.metadata.aiProcessingTime).toLocaleString(undefined, dateOptions)
        : null;

    return (
        <Card className="overflow-hidden pb-6">
            <div className="bg-gradient-to-r from-primary/10 to-background p-6 border-b border-border mb-6">
                <div className="mb-4 flex justify-between items-center">
                    <button onClick={onClose} className="text-primary hover:text-primary/80 transition-colors flex items-center">
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
                            {ticket.status === 'in_progress_by_ai' ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {ticket.status.replace(/_/g, ' ')}
                                </span>
                            ) : (
                                ticket.status.replace(/_/g, ' ')
                            )}
                        </Badge>
                        {ticket.metadata?.generatedByAI && (
                            <Badge variant="outline">
                                Generated by AI
                            </Badge>
                        )}
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
                    
                    {ticket.status === 'needs_manual_review' && ticket.metadata?.manualReviewReason && (
                        <div className="mb-6">
                            <h3 className="text-sm uppercase text-amber-600 font-medium mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Manual Review Required
                            </h3>
                            <div className="text-foreground bg-amber-50 dark:bg-amber-950/20 p-4 rounded-md border border-amber-200 dark:border-amber-800 whitespace-pre-wrap text-amber-800 dark:text-amber-300">
                                {ticket.metadata.manualReviewReason}
                            </div>
                        </div>
                    )}
                    
                    {ticket.status === 'resolved' && ticket.metadata?.aiResolution && (
                        <div className="mb-6">
                            <h3 className="text-sm uppercase text-emerald-600 font-medium mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Resolution
                            </h3>
                            <div className="text-foreground bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-md border border-emerald-200 dark:border-emerald-800 whitespace-pre-wrap text-emerald-800 dark:text-emerald-300">
                                {ticket.metadata.aiResolution}
                            </div>
                            
                            {ticket.metadata.aiActionTaken && (
                                <div className="mt-3 text-sm">
                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Action Taken:</span> {ticket.metadata.aiActionTaken}
                                </div>
                            )}
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
                            
                            {ticket.metadata?.aiProcessed && formattedAIProcessingTime && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <h4 className="text-sm font-medium mb-1">AI Processed</h4>
                                    <div className="text-sm text-muted-foreground">
                                        {formattedAIProcessingTime}
                                    </div>
                                </div>
                            )}
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
                        {onEdit && (
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
                        )}
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
                                    <option value="in_progress_by_ai">In Progress by AI</option>
                                    <option value="needs_manual_review">Needs Manual Review</option>
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