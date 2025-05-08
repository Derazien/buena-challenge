import { gql } from '@apollo/client';

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      address
      city
      state
      zipCode
      status
      propertyType
      monthlyRent
      image
      bedrooms
      bathrooms
      sqft
      yearBuilt
      lastRenovated
      amenities
      roi
      occupancyRate
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
      status
      propertyType
      monthlyRent
      image
      bedrooms
      bathrooms
      sqft
      yearBuilt
      lastRenovated
      amenities
      roi
      occupancyRate
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

export const TICKET_UPDATED_SUBSCRIPTION = gql`
  subscription OnTicketUpdated {
    ticketUpdated {
      id
      title
      description
      status
      priority
      propertyId
      propertyAddress
      createdAt
      updatedAt
    }
  }
`;

export const TICKET_CREATED_SUBSCRIPTION = gql`
  subscription OnTicketCreated {
    ticketCreated {
      id
      title
      description
      status
      priority
      propertyId
      propertyAddress
      createdAt
      updatedAt
    }
  }
`;

export const TICKET_DELETED_SUBSCRIPTION = gql`
  subscription OnTicketDeleted {
    ticketDeleted {
      id
      title
      description
      status
      priority
      propertyId
      propertyAddress
      createdAt
      updatedAt
    }
  }
`;