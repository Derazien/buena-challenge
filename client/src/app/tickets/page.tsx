'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import { useTickets } from '@/hooks/useTickets';
import { useNotification } from '@/components/notifications/NotificationContext';
import { TicketFormInput, Ticket, TicketStatus, TicketMetadata, TicketAttachment } from '@/types/api/tickets.types';
import TicketForm from '@/components/tickets/TicketForm';
import { useProperties } from '@/hooks/useProperties';
import TicketFilterTabs from '@/components/tickets/TicketFilterTabs';
import TicketSearchBar from '@/components/tickets/TicketSearchBar';
import TicketList from '@/components/tickets/TicketList';
import TicketDetail from '@/components/tickets/TicketDetail';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import KanbanBoard from '@/components/tickets/KanbanBoard';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText from '@/components/common/AnimatedText';
import Button from '@/components/ui/Button';
import SunflowerIcon from '@/components/icons/SunflowerIcon';

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

const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'in_progress_by_ai':
            return 'destructive';
        case 'under_review':
            return 'info';
        case 'pending_approval':
            return 'secondary';
        case 'completed':
            return 'success';
        default:
            return 'default';
    }
};

// Types for the memoized components
interface FilterProps {
    activeStatus?: TicketStatus;
    onFilterChange: (status: string) => void;
}

interface ListProps {
    tickets: Ticket[];
    onViewTicket: (ticket: Ticket) => void;
}

// Memoized filter component to prevent rerenders
const MemoizedTicketFilter: React.FC<FilterProps> = ({ activeStatus, onFilterChange }) => {
    return useMemo(() => {
        return (
            <TicketFilterTabs
                activeStatus={activeStatus}
                onFilterChange={onFilterChange}
            />
        );
    }, [activeStatus, onFilterChange]);
};

// Memoized list component to prevent rerenders
const MemoizedTicketList: React.FC<ListProps> = ({ tickets, onViewTicket }) => {
    return useMemo(() => {
        return (
            <TicketList
                tickets={tickets}
                onViewTicket={onViewTicket}
                onEditTicket={() => { }}
            />
        );
    }, [tickets, onViewTicket]);
};

export default function TicketsPage() {
    const { tickets, loading, error, filters, setFilters, createTicket, updateTicket, generateTestTicket, isSubmitting } = useTickets();
    const { addNotification } = useNotification();
    const { properties } = useProperties();

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

    // Check URL parameters for showing the new ticket form
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('new') === 'true') {
            setIsCreating(true);
        }

        // Get view mode from URL or localStorage
        const savedViewMode = localStorage.getItem('ticketsViewMode');
        if (urlParams.get('view') === 'list') {
            setViewMode('list');
        } else if (urlParams.get('view') === 'kanban') {
            setViewMode('kanban');
        } else if (savedViewMode === 'list' || savedViewMode === 'kanban') {
            setViewMode(savedViewMode as 'list' | 'kanban');
        } else {
            // Default to Kanban view if no preference is set
            setViewMode('kanban');
            localStorage.setItem('ticketsViewMode', 'kanban');
        }
    }, []);

    // Save view mode preference
    useEffect(() => {
        localStorage.setItem('ticketsViewMode', viewMode);
    }, [viewMode]);

    // Update filters when search query changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters({ ...filters, searchQuery });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, setFilters, filters]);

    const handleCreateTicket = async (data: TicketFormInput) => {
        try {
            // Extract the required fields for API
            const ticketData = {
                title: data.title || data.description.substring(0, 50),
                description: data.description,
                priority: data.priority || 'medium',
                status: 'open' as TicketStatus,
                propertyId: data.propertyId || 0,
                // Include all additional metadata in the main ticket data
                metadata: {
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    estimatedCost: data.estimatedCost,
                    dueDate: data.dueDate,
                    notes: data.notes,
                    useAI: data.useAI,
                    attachments: [] as TicketAttachment[]
                } as TicketMetadata
            };

            // If we have file attachments, process them
            let fileUploadResults = [];
            if (data.attachments && data.attachments.length > 0) {
                console.log(`Processing ${data.attachments.length} attachments`);
                // Here you would typically upload the files and get back URLs
                // For now, we'll create placeholder data
                fileUploadResults = await Promise.all(
                    data.attachments.map(async (file) => ({
                        filename: file.name,
                        size: file.size,
                        type: file.type,
                        // This would be replaced with actual upload logic
                        url: URL.createObjectURL(file)
                    }))
                );

                // Add the attachments to the ticket data
                ticketData.metadata.attachments = fileUploadResults;
            }

            await createTicket(ticketData);

            setIsCreating(false);
            addNotification({
                type: 'success',
                message: 'Ticket created successfully'
            });
        } catch (error) {
            console.error('Error creating ticket:', error);
            addNotification({
                type: 'error',
                message: 'Failed to create ticket. Please try again.'
            });
        }
    };

    const handleUpdateTicket = async (data: TicketFormInput) => {
        // This functionality has been removed as per requirements
        console.log("Edit ticket functionality has been removed");
        setSelectedTicket(null);
    };

    const handleStatusChange = async (ticketId: number, newStatus: TicketStatus) => {
        try {
            await updateTicket({
                id: ticketId,
                status: newStatus
            });

            addNotification({
                type: 'success',
                message: `Ticket status updated to ${newStatus}`
            });
        } catch (error) {
            console.error('Error updating ticket status:', error);
            addNotification({
                type: 'error',
                message: 'Failed to update ticket status. Please try again.'
            });
        }
    };

    const handleFilterChange = (status: string) => {
        const newFilters = {
            ...filters,
            status: status === 'all' ? undefined : status.toLowerCase() as TicketStatus
        };
        setFilters(newFilters);
    };

    const handleViewTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsViewing(true);
    };

    const handleGenerateTestTicket = async () => {
        try {
            // Get a random property if none is selected
            let propertyId = filters.propertyId;
            if (!propertyId && properties.length > 0) {
                const randomIndex = Math.floor(Math.random() * properties.length);
                propertyId = properties[randomIndex].id;
            }

            if (!propertyId) {
                addNotification({
                    type: 'error',
                    message: 'No property selected or available for ticket creation'
                });
                return;
            }

            // Call the API to generate a test ticket
            await generateTestTicket(propertyId);
            
            addNotification({
                type: 'success',
                message: 'Test ticket generated successfully! AI is processing the ticket...'
            });
        } catch (error) {
            console.error('Error generating test ticket:', error);
            addNotification({
                type: 'error',
                message: 'Failed to generate test ticket. Please try again.'
            });
        }
    };

    // Handle error state
    if (error) {
        return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
    }

    // Handle loading state
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <LoadingSpinner text="Loading tickets..." />
                </Card>
            </div>
        );
    }

    // Ticket form modal (create or edit)
    if (isCreating) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex mb-6">
                    <button
                        onClick={() => setIsCreating(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Tickets
                    </button>
                </div>
                <TicketForm
                    mode="create"
                    onSubmit={handleCreateTicket}
                    onCancel={() => setIsCreating(false)}
                    isSubmitting={isSubmitting}
                />
            </div>
        );
    }

    // Ticket details view
    if (isViewing && selectedTicket) {
        return (
            <div className="container mx-auto px-4 py-8">
                <TicketDetail
                    ticket={selectedTicket}
                    onClose={() => {
                        setSelectedTicket(null);
                        setIsViewing(false);
                    }}
                    onStatusChange={(status) => handleStatusChange(selectedTicket.id, status)}
                />
            </div>
        );
    }

    // Main tickets list view
    return (
        <div className="container mx-auto px-4 pb-12 pt-6 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 bg-gradient-to-r from-background to-muted rounded-xl p-6 shadow-sm border border-border"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        <AnimatedText
                            text="Tickets Management"
                            animation="slide-up"
                            once={false}
                            type="word"
                        />
                    </h1>
                    <div className="flex space-x-4 items-center">
                        <Button
                            onClick={handleGenerateTestTicket}
                            variant="default"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <SunflowerIcon className="h-4 w-4 mr-2" />
                                    Generate Test Ticket
                                </>
                            )}
                        </Button>
                        <div className="flex items-center space-x-2">
                            <button
                                className={`px-2 py-1 rounded text-sm ${viewMode === 'list'
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'bg-muted text-foreground hover:bg-muted/80'}`}
                                onClick={() => setViewMode('list')}
                            >
                                List
                            </button>
                            <button
                                className={`px-2 py-1 rounded text-sm ${viewMode === 'kanban'
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'bg-muted text-foreground hover:bg-muted/80'}`}
                                onClick={() => setViewMode('kanban')}
                            >
                                Kanban
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <TicketSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </motion.div>

            <AnimatePresence mode="wait">
                {viewMode === 'list' && (
                    <motion.div
                        key="list-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MemoizedTicketFilter
                            activeStatus={filters.status}
                            onFilterChange={handleFilterChange}
                        />
                        <MemoizedTicketList
                            tickets={tickets}
                            onViewTicket={handleViewTicket}
                        />
                    </motion.div>
                )}

                {viewMode === 'kanban' && (
                    <motion.div
                        key="kanban-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                    >
                        <Card className="p-4 shadow-sm">
                            <KanbanBoard
                                tickets={tickets}
                                onViewTicket={handleViewTicket}
                                onStatusChange={handleStatusChange}
                            />
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}