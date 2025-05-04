'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { useOpenTickets } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/Skeleton';
import { Ticket } from '@/types/api/tickets.types';
import AnimatedCard from '@/components/common/AnimatedCard';
import AnimatedText from '@/components/common/AnimatedText';

// Define the type based on what actually comes from the hook
type OpenTicket = Ticket & {
    propertyAddress: string;
    propertyId: number;
};

const getPriorityVariant = (priority: string) => {
    switch (priority) {
        case 'LOW': return 'default';
        case 'MEDIUM': return 'warning';
        case 'HIGH': return 'danger';
        case 'URGENT': return 'danger';
        default: return 'default';
    }
};

const getPriorityIcon = (priority: string) => {
    switch (priority) {
        case 'LOW':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            );
        case 'MEDIUM':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
            );
        case 'HIGH':
        case 'URGENT':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
            );
        default:
            return null;
    }
};

const OpenTicketsCard = () => {
    const { loading, error, openTickets, ticketCount } = useOpenTickets();

    if (loading) {
        return (
            <AnimatedCard className="p-5">
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-10" />
                    </div>
                    <Skeleton className="h-10 w-12" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </AnimatedCard>
        );
    }

    if (error) {
        return (
            <AnimatedCard className="p-5" borderColor="danger">
                <div className="text-destructive">Error loading ticket data</div>
            </AnimatedCard>
        );
    }

    return (
        <AnimatedCard className="p-5" hoverEffect="scale" delay={0.2} once={false} borderColor="warning">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-medium text-foreground">
                    <AnimatedText
                        text="Open Tickets"
                        animation="slide-up"
                        type="word"
                        once={false}
                    />
                </h2>
                <Badge variant="info">{ticketCount}</Badge>
            </div>

            <div className="text-2xl font-bold text-amber-500/90">{ticketCount}</div>
            <div className="mt-1 text-muted-foreground text-sm">Needs attention</div>

            <div className="mt-6 space-y-3">
                {openTickets.length > 0 ? (
                    openTickets.slice(0, 2).map((ticket) => (
                        <div key={ticket.id} className="p-4 rounded-lg border border-border bg-gradient-to-r from-background to-muted hover:shadow-sm transition-shadow">
                            <div className="flex justify-between">
                                <div className="font-medium text-foreground">{ticket.title}</div>
                                <Badge variant={getPriorityVariant(ticket.priority)} className="flex items-center">
                                    {getPriorityIcon(ticket.priority)}
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">{ticket.description}</div>
                            <div className="text-xs text-muted-foreground mt-2">{ticket.propertyAddress}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        No open tickets at this time
                    </div>
                )}

                {openTickets.length > 2 && (
                    <div className="text-center text-sm text-muted-foreground py-2 bg-muted rounded-md">
                        +{openTickets.length - 2} more tickets
                    </div>
                )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <Link href="/tickets">
                    <Button variant="outline" className="w-full">
                        View All
                    </Button>
                </Link>
                <Link href="/tickets?new=true">
                    <Button className="w-full">
                        Create New
                    </Button>
                </Link>
            </div>
        </AnimatedCard>
    );
};

export default OpenTicketsCard;