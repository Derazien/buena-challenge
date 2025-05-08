import { gql } from '@apollo/client';

// Query to get the portfolio summary
export const GET_PORTFOLIO_SUMMARY = gql`
  query GetPortfolioSummary {
    portfolioSummary {
      monthlyRentIn
      allocatedReservePercentage
      forecastedYield
      euribor3M
      germanCPI
      cagrProjection
      threeYearProjection {
        year
        amount
      }
      availableToInvest
      availableToReinvest
      reserveBalance
      monthlyGrowth
      targetMonthlyRent
      properties {
        id
        name
        location
        monthlyRent
        occupancyRate
      }
      allocationBreakdown {
        category
        percentage
        amount
      }
      monthlyPerformance {
        month
        income
      }
    }
  }
`;

// Mutation to allocate funds to investment options
export const ALLOCATE_FUNDS = gql`
  mutation AllocateFunds($input: AllocateFundsInput!) {
    allocateFunds(input: $input) {
      success
      message
      investmentId
      transactionId
    }
  }
`;

// Query to get recommended investment options
export const GET_INVESTMENT_OPTIONS = gql`
  query GetInvestmentOptions($surplusCash: Float!, $riskProfile: String!) {
    investmentOptions(surplusCash: $surplusCash, riskProfile: $riskProfile) {
      id
      name
      type
      expectedReturn
      risk
      minimumInvestment
      description
    }
  }
`;

// Query to get historical returns
export const GET_HISTORICAL_RETURNS = gql`
  query GetHistoricalReturns {
    historicalReturns {
      date
      value
    }
  }
`;

export const GET_USER_INVESTMENTS = gql`
  query GetUserInvestments {
    userInvestments {
      investments {
        id
        investmentId
        name
        type
        amount
        expectedReturn
        risk
        date
      }
      totalInvested
    }
  }
`;