import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { useTickets } from '@/hooks/useTickets';
import { Ticket } from '@/types/api/tickets.types';
import { useNotification } from '@/components/notifications/NotificationContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import canvasConfetti from 'canvas-confetti';

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
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    if (activeId === overId) return;
    
    // Find the ticket that was dragged
    const draggedTicket = tickets.find(ticket => ticket.id.toString() === activeId);
    if (!draggedTicket) return;
    
    // Find the target column based on data-column attribute
    const targetColumnElement = findAncestorWithDataColumn(over.id);
    if (!targetColumnElement) return;
    
    const targetColumn = targetColumnElement.getAttribute('data-column');
    let newPriority;
    
    switch (targetColumn) {
      case 'urgent':
        newPriority = 'URGENT';
        break;
      case 'high':
        newPriority = 'HIGH';
        break;
      case 'normal':
        newPriority = 'MEDIUM';
        break;
      default:
        return;
    }
    
    try {
      await updateTicket({
        id: draggedTicket.id,
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
    }
  };

  const findAncestorWithDataColumn = (id: string | number): HTMLElement | null => {
    const element = document.getElementById(id.toString());
    if (!element) return null;
    
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
        status: newStatus
      });
      
      // Trigger confetti if the ticket is resolved
      if (newStatus.toLowerCase() === 'resolved') {
        triggerConfetti();
      }
      
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

  const triggerConfetti = () => {
    canvasConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading tickets..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="h-full">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <KanbanColumn 
            title="Urgent" 
            tickets={urgentTickets}
            onViewTicket={onViewTicket}
            onEditTicket={onEditTicket}
            onStatusChange={handleStatusChange}
            columnId="urgent"
            color="bg-red-100 border-red-300"
          />
          
          <KanbanColumn 
            title="High" 
            tickets={highTickets}
            onViewTicket={onViewTicket}
            onEditTicket={onEditTicket}
            onStatusChange={handleStatusChange}
            columnId="high"
            color="bg-amber-100 border-amber-300"
          />
          
          <KanbanColumn 
            title="Normal" 
            tickets={normalTickets}
            onViewTicket={onViewTicket}
            onEditTicket={onEditTicket}
            onStatusChange={handleStatusChange}
            columnId="normal"
            color="bg-blue-100 border-blue-300"
          />
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard; 