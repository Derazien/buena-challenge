'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { useTickets } from '@/hooks/useTickets';
import { useNotification } from '@/components/notifications/NotificationContext';
import { TicketFormInput, Ticket, TicketStatus } from '@/types/api/tickets.types';
import TicketForm from '@/components/tickets/TicketForm';
import { useProperties } from '@/hooks/useProperties';
import TicketFilterTabs from '@/components/tickets/TicketFilterTabs';
import TicketSearchBar from '@/components/tickets/TicketSearchBar';
import TicketList from '@/components/tickets/TicketList';
import TicketDetail from '@/components/tickets/TicketDetail';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import KanbanBoard from '@/components/tickets/KanbanBoard';

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

export default function TicketsPage() {
    const { tickets, loading, error, filters, setFilters, createTicket, updateTicket, isSubmitting } = useTickets();
    const { addNotification } = useNotification();
    const { properties } = useProperties();

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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
            await createTicket({
                title: data.title || data.description.substring(0, 50),
                description: data.description,
                priority: data.priority || 'medium',
                status: 'open',
                propertyId: data.propertyId || 0
            });

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
        if (!selectedTicket) return;

        try {
            await updateTicket({
                id: selectedTicket.id,
                title: data.title,
                description: data.description,
                priority: data.priority,
                status: data.status
            });

            setIsEditing(false);
            setSelectedTicket(null);
            addNotification({
                type: 'success',
                message: 'Ticket updated successfully'
            });
        } catch (error) {
            console.error('Error updating ticket:', error);
            addNotification({
                type: 'error',
                message: 'Failed to update ticket. Please try again.'
            });
        }
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

    // Function to get property name
    const getPropertyAddress = (propertyId: number) => {
        const property = properties.find(p => p.id === propertyId);
        return property ? property.address : 'Unknown property';
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
                <TicketForm
                    mode="create"
                    onSubmit={handleCreateTicket}
                    onCancel={() => setIsCreating(false)}
                    isSubmitting={isSubmitting}
                />
            </div>
        );
    }

    if (isEditing && selectedTicket) {
        return (
            <div className="container mx-auto px-4 py-8">
                <TicketForm
                    mode="edit"
                    initialData={selectedTicket}
                    onSubmit={handleUpdateTicket}
                    onCancel={() => {
                        setIsEditing(false);
                        setSelectedTicket(null);
                    }}
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
                    onEdit={() => {
                        setIsViewing(false);
                        setIsEditing(true);
                    }}
                    onStatusChange={(status) => handleStatusChange(selectedTicket.id, status)}
                    onBack={() => {
                        setIsViewing(false);
                        setSelectedTicket(null);
                    }}
                />
            </div>
        );
    }

    // Main tickets list view
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tickets</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1 rounded-md ${
                            viewMode === 'list' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`px-3 py-1 rounded-md ${
                            viewMode === 'kanban' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Kanban
                    </button>
                </div>
            </div>

            <TicketSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreateClick={() => setIsCreating(true)}
            />

            {viewMode === 'list' && (
                <>
                    <TicketFilterTabs
                        activeStatus={filters.status}
                        onFilterChange={handleFilterChange}
                    />
                    <TicketList
                        tickets={tickets}
                        onViewTicket={(ticket) => {
                            setSelectedTicket(ticket);
                            setIsViewing(true);
                        }}
                        onEditTicket={(ticket) => {
                            setSelectedTicket(ticket);
                            setIsEditing(true);
                        }}
                    />
                </>
            )}

            {viewMode === 'kanban' && (
                <div className="mt-6">
                    <Card>
                        <KanbanBoard
                            onViewTicket={(ticket) => {
                                setSelectedTicket(ticket);
                                setIsViewing(true);
                            }}
                            onEditTicket={(ticket) => {
                                setSelectedTicket(ticket);
                                setIsEditing(true);
                            }}
                        />
                    </Card>
                </div>
            )}
        </div>
    );
}