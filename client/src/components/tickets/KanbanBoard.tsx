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
import { Ticket, TicketPriority, TicketStatus } from '@/types/api/tickets.types';
import { useNotification } from '@/components/notifications/NotificationContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import AnimatedText from '@/components/common/AnimatedText';
import { motion } from 'framer-motion';
import KanbanItem from './KanbanItem';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

type KanbanBoardProps = {
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onViewTicket, onEditTicket }) => {
  const { tickets, loading, error, updateTicket } = useTickets();
  const { addNotification } = useNotification();

  const [urgentTickets, setUrgentTickets] = useState<Ticket[]>([]);
  const [highTickets, setHighTickets] = useState<Ticket[]>([]);
  const [normalTickets, setNormalTickets] = useState<Ticket[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced from 8 to make dragging easier to start
      },
    })
  );

  // Organize tickets by priority
  useEffect(() => {
    if (tickets) {
      setUrgentTickets(tickets.filter(ticket => ticket.priority.toLowerCase() === 'urgent'));
      setHighTickets(tickets.filter(ticket => ticket.priority.toLowerCase() === 'high'));
      setNormalTickets(tickets.filter(ticket =>
        ticket.priority.toLowerCase() !== 'urgent' &&
        ticket.priority.toLowerCase() !== 'high'
      ));
    }
  }, [tickets]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());

    // Find which column the dragged item belongs to and set active ticket
    const ticket = tickets.find(t => t.id.toString() === active.id.toString());
    if (ticket) {
      setActiveTicket(ticket);
      if (ticket.priority.toLowerCase() === 'urgent') {
        setActiveColumn('urgent');
      } else if (ticket.priority.toLowerCase() === 'high') {
        setActiveColumn('high');
      } else {
        setActiveColumn('normal');
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
      // Extract the column name from over.id (e.g., "droppable-urgent" -> "urgent")
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

    let newPriority: TicketPriority;

    switch (targetColumn) {
      case 'urgent':
        newPriority = 'URGENT' as TicketPriority;
        break;
      case 'high':
        newPriority = 'HIGH' as TicketPriority;
        break;
      case 'normal':
        newPriority = 'MEDIUM' as TicketPriority;
        break;
      default:
        return;
    }

    // Optimistic UI update
    updateLocalTickets(finalActiveTicket.id, newPriority);

    try {
      await updateTicket({
        id: finalActiveTicket.id,
        priority: newPriority
      });

      addNotification({
        type: 'success',
        message: `Ticket priority updated to ${newPriority}`
      });
    } catch (error) {
      console.error('Error updating ticket priority:', error);
      addNotification({
        type: 'error',
        message: 'Failed to update ticket priority'
      });

      // Revert the local state if the API call fails
      if (tickets) {
        setUrgentTickets(tickets.filter(ticket => ticket.priority.toLowerCase() === 'urgent'));
        setHighTickets(tickets.filter(ticket => ticket.priority.toLowerCase() === 'high'));
        setNormalTickets(tickets.filter(ticket =>
          ticket.priority.toLowerCase() !== 'urgent' &&
          ticket.priority.toLowerCase() !== 'high'
        ));
      }
    }
  };

  // Update local state before API call for immediate UI feedback
  const updateLocalTickets = (ticketId: number, newPriority: TicketPriority) => {
    // Find the ticket in all columns
    const ticket = [...urgentTickets, ...highTickets, ...normalTickets].find(t => t.id === ticketId);
    if (!ticket) return;

    // Create a copy with updated priority
    const updatedTicket = { ...ticket, priority: newPriority };

    // Remove from all columns
    setUrgentTickets(prev => prev.filter(t => t.id !== ticketId));
    setHighTickets(prev => prev.filter(t => t.id !== ticketId));
    setNormalTickets(prev => prev.filter(t => t.id !== ticketId));

    // Add to the correct column
    if (newPriority === 'URGENT') {
      setUrgentTickets(prev => [...prev, updatedTicket]);
    } else if (newPriority === 'HIGH') {
      setHighTickets(prev => [...prev, updatedTicket]);
    } else if (newPriority === 'MEDIUM') {
      setNormalTickets(prev => [...prev, updatedTicket]);
    }
  };

  const findAncestorWithDataColumn = (id: string | number): HTMLElement | null => {
    // Try to get element by ID first
    let element = document.getElementById(id.toString());

    // If not found by ID, try querySelector on data-column attribute
    if (!element && typeof id === 'string' && id.startsWith('droppable-')) {
      const columnId = id.replace('droppable-', '');
      element = document.querySelector(`[data-column="${columnId}"]`);
      return element as HTMLElement;
    }

    if (!element) return null;

    // Traverse up the DOM tree
    let current: HTMLElement | null = element;
    while (current) {
      if (current.hasAttribute('data-column')) {
        return current;
      }
      current = current.parentElement;
    }

    return null;
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      await updateTicket({
        id: ticketId,
        status: newStatus as TicketStatus
      });

      addNotification({
        type: 'success',
        message: `Ticket status updated to ${newStatus}`
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

  return (
    <div className="h-full">
      <Card className="p-4 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-1">Kanban Board</h2>
            <p className="text-sm text-muted-foreground">
              <AnimatedText
                text="Drag tickets between columns to change priority"
                className="text-sm"
                animation="fade"
                once={false}
              />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="danger" className="flex items-center gap-1 py-1 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
              </svg>
              Urgent
            </Badge>
            <Badge variant="warning" className="flex items-center gap-1 py-1 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              High
            </Badge>
            <Badge variant="info" className="flex items-center gap-1 py-1 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Normal
            </Badge>
          </div>
        </div>
      </Card>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-240px)] min-h-[500px]">
          <KanbanColumn
            title="Urgent"
            tickets={urgentTickets}
            onViewTicket={onViewTicket}
            onEditTicket={onEditTicket}
            onStatusChange={handleStatusChange}
            columnId="urgent"
            color="bg-destructive/10 border-destructive/30"
            titleColor="text-destructive"
            iconClass="text-destructive"
            isActive={activeColumn !== null && activeColumn !== 'urgent'}
            isDraggedOver={draggedOverColumn === 'urgent'}
          />

          <KanbanColumn
            title="High"
            tickets={highTickets}
            onViewTicket={onViewTicket}
            onEditTicket={onEditTicket}
            onStatusChange={handleStatusChange}
            columnId="high"
            color="bg-amber-500/10 border-amber-500/30"
            titleColor="text-amber-600"
            iconClass="text-amber-500"
            isActive={activeColumn !== null && activeColumn !== 'high'}
            isDraggedOver={draggedOverColumn === 'high'}
          />

          <KanbanColumn
            title="Normal"
            tickets={normalTickets}
            onViewTicket={onViewTicket}
            onEditTicket={onEditTicket}
            onStatusChange={handleStatusChange}
            columnId="normal"
            color="bg-primary/10 border-primary/30"
            titleColor="text-primary"
            iconClass="text-primary"
            isActive={activeColumn !== null && activeColumn !== 'normal'}
            isDraggedOver={draggedOverColumn === 'normal'}
          />
        </div>

        {/* Add drag overlay for better visual feedback */}
        <DragOverlay>
          {activeId && activeTicket ? (
            <div className="opacity-80 w-64 transform rotate-1 scale-105">
              <KanbanItem
                ticket={activeTicket}
                onViewTicket={() => { }}
                onEditTicket={() => { }}
                onStatusChange={() => { }}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;