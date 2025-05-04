import { gql } from '@apollo/client';

// Fragment to reuse ticket fields
export const TICKET_FRAGMENT = gql`
  fragment TicketFields on Ticket {
    id
    title
    description
    priority
    status
    propertyId
    propertyAddress
    createdAt
    updatedAt
  }
`;

// Query to get all tickets with optional filters
export const GET_TICKETS = gql`
  query GetTickets($filters: TicketFiltersInput) {
    tickets(filters: $filters) {
      ...TicketFields
    }
  }
  ${TICKET_FRAGMENT}
`;

// Query to get a single ticket by ID
export const GET_TICKET = gql`
  query GetTicket($id: Int!) {
    ticket(id: $id) {
      ...TicketFields
    }
  }
  ${TICKET_FRAGMENT}
`;

// Mutation to create a new ticket
export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      ...TicketFields
    }
  }
  ${TICKET_FRAGMENT}
`;

// Mutation to update an existing ticket
export const UPDATE_TICKET = gql`
  mutation UpdateTicket($input: UpdateTicketInput!) {
    updateTicket(input: $input) {
      ...TicketFields
    }
  }
  ${TICKET_FRAGMENT}
`;

// Mutation to delete a ticket
export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: Int!) {
    deleteTicket(id: $id) {
      id
      success
    }
  }
`;

// Subscription for ticket updates
export const TICKET_UPDATED = gql`
  subscription TicketUpdated {
    ticketUpdated {
      ...TicketFields
    }
  }
  ${TICKET_FRAGMENT}
`;

// Mutation to classify a ticket using AI
export const CLASSIFY_TICKET = gql`
  mutation ClassifyTicket($description: String!) {
    classifyTicket(description: $description) {
      title
      priority
      category
      estimatedTimeToFix
      suggestedAction
    }
  }
`; 