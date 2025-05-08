import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  useDndMonitor
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { useTickets } from '@/hooks/useTickets';
import { Ticket, TicketStatus } from '@/types/api/tickets.types';
import { useNotification } from '@/components/notifications/NotificationContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import AnimatedText from '@/components/common/AnimatedText';
import { motion } from 'framer-motion';
import KanbanItem from './KanbanItem';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type KanbanBoardProps = {
  onViewTicket: (ticket: Ticket) => void;
  tickets: Ticket[];
  onStatusChange?: (ticketId: number, newStatus: TicketStatus) => Promise<void>;
};

// Sort function for tickets based on criteria
const sortTickets = (tickets: Ticket[]) => {
  return [...tickets].sort((a, b) => {
    // Sort by createdAt date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onViewTicket, tickets, onStatusChange }) => {
  const { loading, error, updateTicket } = useTickets();
  const { addNotification } = useNotification();

  const [inProgressByAiTickets, setInProgressByAiTickets] = useState<Ticket[]>([]);
  const [needsManualReviewTickets, setNeedsManualReviewTickets] = useState<Ticket[]>([]);
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced from 8 to make dragging easier to start
      },
    })
  );

  // Organize tickets by status
  useEffect(() => {
    if (tickets) {
      // Helper function to normalize status
      const normalizeStatus = (status: string): TicketStatus => {
        const normalized = status.toLowerCase().replace(/\s+/g, '_');
        switch (normalized) {
          case 'in_progress_by_ai':
            return 'in_progress_by_ai';
          case 'needs_manual_review':
            return 'needs_manual_review';
          case 'resolved':
            return 'resolved';
          default:
            return 'in_progress_by_ai'; // Default status
        }
      };

      // Filter tickets by status
      const inProgress = tickets.filter(ticket =>
        normalizeStatus(ticket.status) === 'in_progress_by_ai'
      );
      const needsManualReview = tickets.filter(ticket =>
        normalizeStatus(ticket.status) === 'needs_manual_review'
      );
      const resolved = tickets.filter(ticket =>
        normalizeStatus(ticket.status) === 'resolved'
      );

      // Update state with filtered tickets
      setInProgressByAiTickets(inProgress);
      setNeedsManualReviewTickets(needsManualReview);
      setResolvedTickets(resolved);

      // Log for debugging
      console.log('Tickets organized:', {
        inProgress: inProgress.length,
        needsManualReview: needsManualReview.length,
        resolved: resolved.length,
        total: tickets.length,
        allTickets: tickets.map(t => ({ id: t.id, status: t.status, normalized: normalizeStatus(t.status) }))
      });
    }
  }, [tickets]);

  // Function to auto-sort tickets within each column
  const handleAutoSort = () => {
    setIsSorting(true);

    if (tickets) {
      try {
        // Sort tickets in each column
        const sortedInProgressByAi = sortTickets(inProgressByAiTickets);
        const sortedNeedsManualReview = sortTickets(needsManualReviewTickets);
        const sortedResolved = sortTickets(resolvedTickets);

        // Update state
        setInProgressByAiTickets(sortedInProgressByAi);
        setNeedsManualReviewTickets(sortedNeedsManualReview);
        setResolvedTickets(sortedResolved);

        addNotification({
          type: 'success',
          message: 'Tickets sorted successfully'
        });
      } catch (error) {
        console.error('Error sorting tickets:', error);
        addNotification({
          type: 'error',
          message: 'Failed to sort tickets'
        });
      } finally {
        setIsSorting(false);
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());

    // Find which column the dragged item belongs to and set active ticket
    const ticket = tickets.find(t => t.id.toString() === active.id.toString());
    if (ticket) {
      setActiveTicket(ticket);
      // Determine which column the ticket belongs to based on status
      if (ticket.status.toLowerCase() === 'in_progress_by_ai') {
        setActiveColumn('in_progress_by_ai');
      } else if (ticket.status.toLowerCase() === 'needs_manual_review') {
        setActiveColumn('needs_manual_review');
      } else if (ticket.status.toLowerCase() === 'resolved') {
        setActiveColumn('resolved');
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setDraggedOverColumn(null);
      return;
    }

    // Check if over.id is a column identifier directly
    if (typeof over.id === 'string' && over.id.startsWith('droppable-')) {
      // Extract the column name from over.id (e.g., "droppable-in_progress" -> "in_progress")
      const column = over.id.replace('droppable-', '');
      setDraggedOverColumn(column);
      return;
    }

    // If not a direct column, find column through data-column attribute
    const targetColumnElement = findAncestorWithDataColumn(over.id);
    if (targetColumnElement) {
      const column = targetColumnElement.getAttribute('data-column');
      setDraggedOverColumn(column);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Before clearing states, capture the values we need
    const finalDraggedColumn = draggedOverColumn;
    const finalActiveTicket = activeTicket;

    setActiveId(null);
    setActiveColumn(null);
    setDraggedOverColumn(null);
    setActiveTicket(null);

    if (!over || !finalDraggedColumn || !finalActiveTicket) return;

    // Find the target column - either directly from the over ID or from the data-column attribute
    let targetColumn = finalDraggedColumn;
    if (!targetColumn) {
      // Fallback check - directly check if over.id is a droppable-* identifier
      if (typeof over.id === 'string' && over.id.startsWith('droppable-')) {
        targetColumn = over.id.replace('droppable-', '');
      } else {
        // Use DOM traversal as a last resort
        const targetColumnElement = findAncestorWithDataColumn(over.id);
        if (!targetColumnElement) return;
        const column = targetColumnElement.getAttribute('data-column');
        if (!column) return;
        targetColumn = column;
      }
    }

    let newStatus: TicketStatus;

    switch (targetColumn) {
      case 'in_progress_by_ai':
        newStatus = 'in_progress_by_ai';
        break;
      case 'needs_manual_review':
        newStatus = 'needs_manual_review';
        break;
      case 'resolved':
        newStatus = 'resolved';
        break;
      default:
        return;
    }

    // Optimistic UI update
    updateLocalTickets(finalActiveTicket.id, newStatus);

    try {
      await updateTicket({
        id: finalActiveTicket.id,
        status: newStatus
      });

      addNotification({
        type: 'success',
        message: `Ticket status updated to ${newStatus.replace(/_/g, ' ')}`
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      addNotification({
        type: 'error',
        message: 'Failed to update ticket status'
      });

      // Revert the local state if the API call fails
      if (tickets) {
        refreshTicketsByStatus();
      }
    }
  };

  // Refresh the tickets in each status column
  const refreshTicketsByStatus = () => {
    if (!tickets) return;

    setInProgressByAiTickets(tickets.filter(ticket => ticket.status.toLowerCase() === 'in_progress_by_ai'));
    setNeedsManualReviewTickets(tickets.filter(ticket => ticket.status.toLowerCase() === 'needs_manual_review'));
    setResolvedTickets(tickets.filter(ticket => ticket.status.toLowerCase() === 'resolved'));
  };

  // Update local state before API call for immediate UI feedback
  const updateLocalTickets = (ticketId: number, newStatus: TicketStatus) => {
    // Find the ticket in all columns
    const ticket = [...inProgressByAiTickets, ...needsManualReviewTickets, ...resolvedTickets]
      .find(t => t.id === ticketId);

    if (!ticket) return;

    // Create a copy with updated status
    const updatedTicket = { ...ticket, status: newStatus };

    // Remove from all columns
    setInProgressByAiTickets(prev => prev.filter(t => t.id !== ticketId));
    setNeedsManualReviewTickets(prev => prev.filter(t => t.id !== ticketId));
    setResolvedTickets(prev => prev.filter(t => t.id !== ticketId));

    // Add to the correct column
    switch (newStatus) {
      case 'in_progress_by_ai':
        setInProgressByAiTickets(prev => [...prev, updatedTicket]);
        break;
      case 'needs_manual_review':
        setNeedsManualReviewTickets(prev => [...prev, updatedTicket]);
        break;
      case 'resolved':
        setResolvedTickets(prev => [...prev, updatedTicket]);
        break;
    }
  };

  const findAncestorWithDataColumn = (id: string | number): HTMLElement | null => {
    const element = document.getElementById(`sortable-${id}`);
    if (!element) return null;

    let current = element;
    while (current && !current.getAttribute('data-column')) {
      const parent = current.parentElement;
      if (!parent) break;
      current = parent;
    }

    return current.getAttribute('data-column') ? current : null;
  };

  // Handle status change function
  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      // Normalize the status value
      const normalizedStatus = newStatus.toLowerCase() as TicketStatus;
      
      if (onStatusChange) {
        // Use the provided onStatusChange prop
        await onStatusChange(ticketId, normalizedStatus);
      } else {
        // Use the hook's updateTicket function as fallback
        await updateTicket({
          id: ticketId,
          status: normalizedStatus
        });
      }
      
      // Local state update
      updateLocalTickets(ticketId, normalizedStatus);
      
      addNotification({
        type: 'success',
        message: `Ticket moved to ${formatStatusName(newStatus)}`
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      addNotification({
        type: 'error',
        message: 'Failed to update ticket status'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading tickets..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress_by_ai':
        return 'bg-indigo-500';
      case 'needs_manual_review':
        return 'bg-purple-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatusName = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="h-full">
      <Card className="p-4 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-1">Kanban Board</h2>
            <p className="text-sm text-muted-foreground">
              <AnimatedText
                text="Drag tickets between columns to change status"
                className="text-sm"
                animation="fade"
                once={false}
              />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="destructive" className="flex items-center gap-1 py-1 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              In Progress by AI
            </Badge>
            <Badge variant="warning" className="flex items-center gap-1 py-1 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Needs Manual Review
            </Badge>
            <Badge variant="success" className="flex items-center gap-1 py-1 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
              </svg>
              Resolved
            </Badge>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Task Board</h2>

        <Button
          variant="outline"
          onClick={handleAutoSort}
          disabled={isSorting || !tickets || tickets.length === 0}
          className="flex items-center gap-2 px-3 py-2"
        >
          {isSorting ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1"></span>
              Sorting...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M11 5h10"></path>
                <path d="M11 9h7"></path>
                <path d="M11 13h4"></path>
                <path d="M3 17h18"></path>
                <path d="M3 21h18"></path>
                <path d="M3 9l4-4 4 4"></path>
                <path d="M3 13V5"></path>
              </svg>
              Auto Sort
            </>
          )}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-240px)] min-h-[500px]">
          <KanbanColumn
            title="In Progress by AI"
            columnId="in_progress_by_ai"
            tickets={inProgressByAiTickets}
            onViewTicket={onViewTicket}
            icon={
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
            }
          />

          <KanbanColumn
            title="Needs Manual Review"
            columnId="needs_manual_review"
            tickets={needsManualReviewTickets}
            onViewTicket={onViewTicket}
            icon={
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            }
          />

          <KanbanColumn
            title="Resolved"
            columnId="resolved"
            tickets={resolvedTickets}
            onViewTicket={onViewTicket}
            icon={
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            }
          />
        </div>

        {/* Add drag overlay for better visual feedback */}
        <DragOverlay>
          {activeId && activeTicket ? (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-primary max-w-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium line-clamp-1">{activeTicket.title}</h3>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(activeTicket.status)}`}></div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{activeTicket.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs">
                  #{activeTicket.id}
                </span>
                <Badge variant="outline" className="text-xs">
                  {formatStatusName(activeTicket.status)}
                </Badge>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;