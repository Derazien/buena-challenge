import { gql } from '@apollo/client';

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      address
      city
      state
      zipCode
      leases {
        id
        startDate
        endDate
        monthlyRent
        tenantName
        isActive
      }
      tickets {
        id
        title
        description
        priority
        status
        createdAt
      }
      cashFlows {
        id
        amount
        type
        category
        date
      }
    }
  }
`;

export const GET_PROPERTY = gql`
  query GetProperty($id: Int!) {
    property(id: $id) {
      id
      address
      city
      state
      zipCode
      leases {
        id
        startDate
        endDate
        monthlyRent
        tenantName
        isActive
      }
      tickets {
        id
        title
        description
        priority
        status
        createdAt
      }
      cashFlows {
        id
        amount
        type
        category
        date
      }
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalProperties
      monthlyIncome {
        currentIncome
        currentExpenses
        currentNet
        monthlyChange
        monthlyData {
          month
          income
          expenses
          net
        }
      }
      ticketStats {
        openTickets {
          id
          title
          description
          priority
          status
          propertyId
          propertyAddress
          createdAt
        }
        totalCount
      }
      leaseStats {
        upcomingRenewals {
          id
          startDate
          endDate
          monthlyRent
          tenantName
          isActive
          propertyId
          propertyAddress
        }
        totalCount
      }
    }
  }
`;

export const GET_MONTHLY_INCOME = gql`
  query GetMonthlyIncome {
    properties {
      id
      cashFlows {
        id
        amount
        type
        category
        date
      }
    }
  }
`;

export const GET_OPEN_TICKETS = gql`
  query GetOpenTickets {
    properties {
      id
      address
      tickets {
        id
        title
        description
        priority
        status
        createdAt
      }
    }
  }
`;

export const GET_UPCOMING_LEASES = gql`
  query GetUpcomingLeases {
    properties {
      id
      address
      leases {
        id
        startDate
        endDate
        monthlyRent
        tenantName
        isActive
      }
    }
  }
`;

export const GET_TICKETS = gql`
  query GetTickets($filters: TicketFiltersInput) {
    tickets(filters: $filters) {
      id
      title
      description
      priority
      status
      createdAt
      updatedAt
      propertyId
      propertyAddress
    }
  }
`;

export const GET_TICKET = gql`
  query GetTicket($id: Int!) {
    ticket(id: $id) {
      id
      title
      description
      priority
      status
      createdAt
      updatedAt
      propertyId
      propertyAddress
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      id
      title
      description
      priority
      status
      createdAt
      propertyId
      propertyAddress
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($input: UpdateTicketInput!) {
    updateTicket(input: $input) {
      id
      title
      description
      priority
      status
      updatedAt
      propertyId
      propertyAddress
    }
  }
`;

export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: Int!) {
    deleteTicket(id: $id) {
      id
      success
    }
  }
`;

export const TICKET_UPDATED_SUBSCRIPTION = gql`
  subscription TicketUpdated {
    ticketUpdated {
      id
      title
      description
      priority
      status
      createdAt
      updatedAt
      propertyId
      propertyAddress
    }
  }
`;