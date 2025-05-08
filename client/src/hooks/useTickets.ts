'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useSubscription, ApolloError } from '@apollo/client';
import { GET_TICKETS, CREATE_TICKET, UPDATE_TICKET, DELETE_TICKET, GENERATE_TEST_TICKET } from '@/graphql/ticket.operations';
import { TICKET_UPDATED_SUBSCRIPTION, TICKET_CREATED_SUBSCRIPTION } from '@/graphql/ticket.operations';
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
        // Poll at a reasonable interval (10 seconds) instead of constant refetching
        pollInterval: 10000,
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

    // Subscribe to new tickets
    const { data: newTicketData } = useSubscription(TICKET_CREATED_SUBSCRIPTION, {
        onData: ({ data }) => {
            if (data?.data?.ticketCreated) {
                console.log('Subscription received new ticket:', data.data.ticketCreated);
                // The Apollo cache will be automatically updated
            }
        },
        onError: (error) => {
            console.error('New ticket subscription error:', error);
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

    const [generateTestTicketMutation] = useMutation(GENERATE_TEST_TICKET, {
        onError: (error) => console.error('Error generating test ticket:', error),
        refetchQueries: [{ query: GET_TICKETS, variables: { filters } }]
    });

    // Effect to refetch when filters change, but not constantly
    useEffect(() => {
        console.log('Filters changed:', filters);
        // No need to immediately refetch - the next poll will handle this
        // But we'll do an initial refetch when filters change
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
                        status: 'in_progress_by_ai',
                        propertyId: parseInt(String(ticketData.propertyId), 10) || 0,
                        metadata: {
                            contactPhone: ticketData.contactPhone,
                            contactEmail: ticketData.contactEmail,
                            estimatedCost: ticketData.estimatedCost,
                            dueDate: ticketData.dueDate,
                            notes: ticketData.notes,
                            useAI: ticketData.useAI || false
                        }
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
            
            // Create the update input object
            const updateInput: any = {
                id,
                ...(data.title && { title: data.title }),
                ...(data.description && { description: data.description }),
                ...(data.status && { status: data.status.toLowerCase() }),
                ...(data.priority && { priority: data.priority.toLowerCase() }),
                ...(data.propertyId && { propertyId: parseInt(String(data.propertyId), 10) })
            };
            
            // Add metadata if needed
            if (data.contactPhone || data.contactEmail || data.estimatedCost || 
                data.dueDate || data.notes || data.useAI !== undefined) {
                updateInput.metadata = {
                    ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
                    ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
                    ...(data.estimatedCost !== undefined && { estimatedCost: data.estimatedCost }),
                    ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
                    ...(data.notes !== undefined && { notes: data.notes }),
                    ...(data.useAI !== undefined && { useAI: data.useAI })
                };
            }

            const { data: response } = await updateTicketMutation({
                variables: {
                    input: updateInput
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

    const generateTestTicket = useCallback(async (propertyId: number) => {
        setIsSubmitting(true);

        try {
            console.log('Generating test ticket for property:', propertyId);
            const { data } = await generateTestTicketMutation({
                variables: { propertyId }
            });

            console.log('Generate test ticket response:', data);
            return data?.generateTestTicket;
        } catch (err) {
            console.error('Error generating test ticket:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [generateTestTicketMutation]);

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
        generateTestTicket,
        isSubmitting,
        lastUpdatedTicket: subscriptionData?.ticketUpdated,
        lastCreatedTicket: newTicketData?.ticketCreated
    };
}