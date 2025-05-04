'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useSubscription, ApolloError } from '@apollo/client';
import { GET_TICKETS, CREATE_TICKET, UPDATE_TICKET, DELETE_TICKET, TICKET_UPDATED_SUBSCRIPTION } from '@/graphql/queries';
import { Ticket, TicketFormInput, TicketFilterOptions, TicketStatus } from '@/types/api/tickets.types';
import { useConfetti } from './useConfetti';

export function useTickets() {
    const [filters, setFilters] = useState<TicketFilterOptions>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { triggerConfetti } = useConfetti();

    // Use the GET_TICKETS query directly with filters
    const { data, loading, error, refetch } = useQuery(GET_TICKETS, {
        variables: {
            filters: {
                status: filters.status?.toLowerCase(),
                priority: filters.priority?.toLowerCase(),
                searchQuery: filters.searchQuery,
                propertyId: filters.propertyId || undefined
            }
        },
        onError: (error) => {
            console.error('Error fetching tickets:', error);
        },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
    });

    // Subscribe to ticket updates
    const { data: subscriptionData } = useSubscription(TICKET_UPDATED_SUBSCRIPTION, {
        onData: ({ data }) => {
            if (data?.data?.ticketUpdated) {
                console.log('Subscription received updated ticket:', data.data.ticketUpdated);
                // The Apollo cache will be automatically updated thanks to our typePolicies in apollo-client.ts

                // Trigger confetti if the updated ticket was marked as resolved
                if (data.data.ticketUpdated.status.toLowerCase() === 'resolved') {
                    triggerConfetti();
                }
            }
        },
        onError: (error) => {
            console.error('Subscription error:', error);
        }
    });

    const [createTicketMutation] = useMutation(CREATE_TICKET, {
        onError: (error) => console.error('Error creating ticket:', error),
        refetchQueries: [{ query: GET_TICKETS, variables: { filters } }]
    });

    const [updateTicketMutation] = useMutation(UPDATE_TICKET, {
        onError: (error) => console.error('Error updating ticket:', error),
        refetchQueries: [{ query: GET_TICKETS, variables: { filters } }]
    });

    const [deleteTicketMutation] = useMutation(DELETE_TICKET, {
        onError: (error) => console.error('Error deleting ticket:', error),
        refetchQueries: [{ query: GET_TICKETS, variables: { filters } }]
    });

    // Effect to refetch when filters change
    useEffect(() => {
        console.log('Filters changed:', filters);
        refetch({
            filters: {
                status: filters.status?.toLowerCase(),
                priority: filters.priority?.toLowerCase(),
                searchQuery: filters.searchQuery,
                propertyId: filters.propertyId || undefined
            }
        }).catch(err => {
            console.error('Error refetching with new filters:', err);
        });
    }, [filters, refetch]);

    const fetchTickets = useCallback(async () => {
        try {
            const result = await refetch();
            return result.data?.tickets || [];
        } catch (err) {
            console.error('Error fetching tickets:', err);
            return [];
        }
    }, [refetch]);

    const createTicket = useCallback(async (ticketData: TicketFormInput) => {
        setIsSubmitting(true);

        try {
            console.log('Creating ticket with data:', ticketData);
            const { data } = await createTicketMutation({
                variables: {
                    input: {
                        title: ticketData.title || ticketData.description.substring(0, 50),
                        description: ticketData.description,
                        priority: (ticketData.priority || 'medium').toLowerCase(),
                        status: 'open',
                        propertyId: parseInt(String(ticketData.propertyId), 10) || 0
                    }
                }
            });

            console.log('Create ticket response:', data);
            return data?.createTicket;
        } catch (err) {
            console.error('Error creating ticket:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [createTicketMutation]);

    const updateTicket = useCallback(async (ticketData: { id: number } & Partial<TicketFormInput>) => {
        setIsSubmitting(true);

        try {
            const { id, ...data } = ticketData;
            console.log('Updating ticket with data:', { id, ...data });
            const { data: response } = await updateTicketMutation({
                variables: {
                    input: {
                        id,
                        ...(data.title && { title: data.title }),
                        ...(data.description && { description: data.description }),
                        ...(data.status && { status: data.status.toLowerCase() }),
                        ...(data.priority && { priority: data.priority.toLowerCase() }),
                        ...(data.propertyId && { propertyId: parseInt(String(data.propertyId), 10) })
                    }
                }
            });

            // Trigger confetti when a ticket is marked as resolved
            if (data.status === 'resolved') {
                triggerConfetti();
            }

            console.log('Update ticket response:', response);
            return response?.updateTicket;
        } catch (err) {
            console.error('Error updating ticket:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [updateTicketMutation, triggerConfetti]);

    const deleteTicket = useCallback(async (id: number) => {
        try {
            const { data } = await deleteTicketMutation({
                variables: { id }
            });

            return data?.deleteTicket?.success || false;
        } catch (err) {
            console.error('Error deleting ticket:', err);
            throw err;
        }
    }, [deleteTicketMutation]);

    const updateTicketStatus = useCallback(async (id: number, status: string) => {
        return updateTicket({ id, status: status as TicketStatus });
    }, [updateTicket]);

    return {
        tickets: data?.tickets || [],
        loading,
        error: error ? error.message : null,
        filters,
        setFilters,
        fetchTickets,
        createTicket,
        updateTicket,
        deleteTicket,
        updateTicketStatus,
        isSubmitting,
        lastUpdatedTicket: subscriptionData?.ticketUpdated
    };
}