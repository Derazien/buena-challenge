import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Timestamp: { input: any; output: any; }
};

export type AllocateFundsInput = {
  amount: Scalars['Float']['input'];
  investmentId: Scalars['String']['input'];
  riskProfile: Scalars['String']['input'];
};

export type CashFlow = {
  __typename?: 'CashFlow';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  date: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  note?: Maybe<Scalars['String']['output']>;
  property: Property;
  propertyId: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type CreatePropertyInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateTicketInput = {
  description: Scalars['String']['input'];
  priority: Scalars['String']['input'];
  propertyId: Scalars['Int']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  leaseStats: LeaseStats;
  monthlyIncome: MonthlyIncomeStats;
  ticketStats: TicketStats;
  totalProperties: Scalars['Int']['output'];
};

export type DeleteTicketResponse = {
  __typename?: 'DeleteTicketResponse';
  id: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type HistoricalReturn = {
  __typename?: 'HistoricalReturn';
  date: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type InvestmentOption = {
  __typename?: 'InvestmentOption';
  description: Scalars['String']['output'];
  expectedReturn: Scalars['String']['output'];
  id: Scalars['String']['output'];
  minimumInvestment: Scalars['String']['output'];
  name: Scalars['String']['output'];
  risk: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type InvestmentResult = {
  __typename?: 'InvestmentResult';
  investmentId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type Lease = {
  __typename?: 'Lease';
  createdAt: Scalars['Timestamp']['output'];
  endDate: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  monthlyRent: Scalars['Float']['output'];
  property: Property;
  propertyId: Scalars['Int']['output'];
  startDate: Scalars['Timestamp']['output'];
  tenantEmail?: Maybe<Scalars['String']['output']>;
  tenantName: Scalars['String']['output'];
  tenantPhone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
};

export type LeaseStats = {
  __typename?: 'LeaseStats';
  totalCount: Scalars['Int']['output'];
  upcomingRenewals: Array<UpcomingRenewal>;
};

export type MonthlyIncome = {
  __typename?: 'MonthlyIncome';
  expenses: Scalars['Float']['output'];
  income: Scalars['Float']['output'];
  month: Scalars['String']['output'];
  net: Scalars['Float']['output'];
};

export type MonthlyIncomeStats = {
  __typename?: 'MonthlyIncomeStats';
  currentExpenses: Scalars['Float']['output'];
  currentIncome: Scalars['Float']['output'];
  currentNet: Scalars['Float']['output'];
  monthlyChange: Scalars['Float']['output'];
  monthlyData: Array<MonthlyIncome>;
};

export type Mutation = {
  __typename?: 'Mutation';
  allocateFunds: InvestmentResult;
  classifyTicket: TicketClassification;
  createProperty: Property;
  createTicket: Ticket;
  deleteTicket: DeleteTicketResponse;
  removeProperty: Property;
  updateProperty: Property;
  updateTicket: Ticket;
};


export type MutationAllocateFundsArgs = {
  input: AllocateFundsInput;
};


export type MutationClassifyTicketArgs = {
  description: Scalars['String']['input'];
};


export type MutationCreatePropertyArgs = {
  createPropertyInput: CreatePropertyInput;
};


export type MutationCreateTicketArgs = {
  input: CreateTicketInput;
};


export type MutationDeleteTicketArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemovePropertyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdatePropertyArgs = {
  updatePropertyInput: UpdatePropertyInput;
};


export type MutationUpdateTicketArgs = {
  input: UpdateTicketInput;
};

export type OpenTicket = {
  __typename?: 'OpenTicket';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  priority: Scalars['String']['output'];
  propertyAddress: Scalars['String']['output'];
  propertyId: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PortfolioSummary = {
  __typename?: 'PortfolioSummary';
  allocatedReservePercentage: Scalars['Float']['output'];
  cagrProjection: Scalars['Float']['output'];
  euribor3M: Scalars['Float']['output'];
  forecastedYield: Scalars['Float']['output'];
  germanCPI: Scalars['Float']['output'];
  monthlyRentIn: Scalars['Float']['output'];
  threeYearProjection: Array<YearlyProjection>;
};

export type Property = {
  __typename?: 'Property';
  address: Scalars['String']['output'];
  cashFlows?: Maybe<Array<CashFlow>>;
  city: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  leases?: Maybe<Array<Lease>>;
  state: Scalars['String']['output'];
  tickets?: Maybe<Array<Ticket>>;
  updatedAt: Scalars['Timestamp']['output'];
  zipCode: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  dashboardStats: DashboardStats;
  historicalReturns: Array<HistoricalReturn>;
  investmentOptions: Array<InvestmentOption>;
  portfolioSummary: PortfolioSummary;
  properties: Array<Property>;
  property: Property;
  ticket: Ticket;
  tickets: Array<Ticket>;
};


export type QueryInvestmentOptionsArgs = {
  riskProfile: Scalars['String']['input'];
  surplusCash: Scalars['Float']['input'];
};


export type QueryPropertyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTicketArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTicketsArgs = {
  filters?: InputMaybe<TicketFiltersInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  ticketCreated: Ticket;
  ticketDeleted: Ticket;
  ticketUpdated: Ticket;
};

export type Ticket = {
  __typename?: 'Ticket';
  createdAt: Scalars['Timestamp']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  priority: Scalars['String']['output'];
  property: Property;
  propertyAddress: Scalars['String']['output'];
  propertyId: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type TicketClassification = {
  __typename?: 'TicketClassification';
  category: Scalars['String']['output'];
  estimatedTimeToFix?: Maybe<Scalars['String']['output']>;
  priority: Scalars['String']['output'];
  suggestedAction?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type TicketFiltersInput = {
  priority?: InputMaybe<Scalars['String']['input']>;
  propertyId?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type TicketStats = {
  __typename?: 'TicketStats';
  openTickets: Array<OpenTicket>;
  totalCount: Scalars['Int']['output'];
};

export type UpcomingRenewal = {
  __typename?: 'UpcomingRenewal';
  endDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  monthlyRent: Scalars['Float']['output'];
  propertyAddress: Scalars['String']['output'];
  propertyId: Scalars['Int']['output'];
  startDate: Scalars['String']['output'];
  tenantName: Scalars['String']['output'];
};

export type UpdatePropertyInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  state?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTicketInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  propertyId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type YearlyProjection = {
  __typename?: 'YearlyProjection';
  amount: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type GetPortfolioSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPortfolioSummaryQuery = { __typename?: 'Query', portfolioSummary: { __typename?: 'PortfolioSummary', monthlyRentIn: number, allocatedReservePercentage: number, forecastedYield: number, euribor3M: number, germanCPI: number, cagrProjection: number, threeYearProjection: Array<{ __typename?: 'YearlyProjection', year: number, amount: number }> } };

export type AllocateFundsMutationVariables = Exact<{
  input: AllocateFundsInput;
}>;


export type AllocateFundsMutation = { __typename?: 'Mutation', allocateFunds: { __typename?: 'InvestmentResult', success: boolean, message: string, investmentId?: string | null } };

export type GetInvestmentOptionsQueryVariables = Exact<{
  surplusCash: Scalars['Float']['input'];
  riskProfile: Scalars['String']['input'];
}>;


export type GetInvestmentOptionsQuery = { __typename?: 'Query', investmentOptions: Array<{ __typename?: 'InvestmentOption', id: string, name: string, type: string, expectedReturn: string, risk: string, minimumInvestment: string, description: string }> };

export type GetHistoricalReturnsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHistoricalReturnsQuery = { __typename?: 'Query', historicalReturns: Array<{ __typename?: 'HistoricalReturn', date: string, value: number }> };

export type GetPropertiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPropertiesQuery = { __typename?: 'Query', properties: Array<{ __typename?: 'Property', id: number, address: string, city: string, state: string, zipCode: string, leases?: Array<{ __typename?: 'Lease', id: number, startDate: any, endDate: any, monthlyRent: number, tenantName: string, isActive: boolean }> | null, tickets?: Array<{ __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, createdAt: any }> | null, cashFlows?: Array<{ __typename?: 'CashFlow', id: number, amount: number, type: string, category: string, date: any }> | null }> };

export type GetPropertyQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPropertyQuery = { __typename?: 'Query', property: { __typename?: 'Property', id: number, address: string, city: string, state: string, zipCode: string, leases?: Array<{ __typename?: 'Lease', id: number, startDate: any, endDate: any, monthlyRent: number, tenantName: string, isActive: boolean }> | null, tickets?: Array<{ __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, createdAt: any }> | null, cashFlows?: Array<{ __typename?: 'CashFlow', id: number, amount: number, type: string, category: string, date: any }> | null } };

export type GetDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardStatsQuery = { __typename?: 'Query', dashboardStats: { __typename?: 'DashboardStats', totalProperties: number, monthlyIncome: { __typename?: 'MonthlyIncomeStats', currentIncome: number, currentExpenses: number, currentNet: number, monthlyChange: number, monthlyData: Array<{ __typename?: 'MonthlyIncome', month: string, income: number, expenses: number, net: number }> }, ticketStats: { __typename?: 'TicketStats', totalCount: number, openTickets: Array<{ __typename?: 'OpenTicket', id: number, title: string, description: string, priority: string, status: string, propertyId: number, propertyAddress: string, createdAt: string }> }, leaseStats: { __typename?: 'LeaseStats', totalCount: number, upcomingRenewals: Array<{ __typename?: 'UpcomingRenewal', id: number, startDate: string, endDate: string, monthlyRent: number, tenantName: string, isActive: boolean, propertyId: number, propertyAddress: string }> } } };

export type GetMonthlyIncomeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthlyIncomeQuery = { __typename?: 'Query', properties: Array<{ __typename?: 'Property', id: number, cashFlows?: Array<{ __typename?: 'CashFlow', id: number, amount: number, type: string, category: string, date: any }> | null }> };

export type GetOpenTicketsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOpenTicketsQuery = { __typename?: 'Query', properties: Array<{ __typename?: 'Property', id: number, address: string, tickets?: Array<{ __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, createdAt: any }> | null }> };

export type GetUpcomingLeasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUpcomingLeasesQuery = { __typename?: 'Query', properties: Array<{ __typename?: 'Property', id: number, address: string, leases?: Array<{ __typename?: 'Lease', id: number, startDate: any, endDate: any, monthlyRent: number, tenantName: string, isActive: boolean }> | null }> };

export type OnTicketUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnTicketUpdatedSubscription = { __typename?: 'Subscription', ticketUpdated: { __typename?: 'Ticket', id: number, title: string, description: string, status: string, priority: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any } };

export type OnTicketCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnTicketCreatedSubscription = { __typename?: 'Subscription', ticketCreated: { __typename?: 'Ticket', id: number, title: string, description: string, status: string, priority: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any } };

export type OnTicketDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnTicketDeletedSubscription = { __typename?: 'Subscription', ticketDeleted: { __typename?: 'Ticket', id: number, title: string, description: string, status: string, priority: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any } };

export type TicketFieldsFragment = { __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any };

export type GetTicketsQueryVariables = Exact<{
  filters?: InputMaybe<TicketFiltersInput>;
}>;


export type GetTicketsQuery = { __typename?: 'Query', tickets: Array<{ __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any }> };

export type GetTicketQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetTicketQuery = { __typename?: 'Query', ticket: { __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any } };

export type CreateTicketMutationVariables = Exact<{
  input: CreateTicketInput;
}>;


export type CreateTicketMutation = { __typename?: 'Mutation', createTicket: { __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any } };

export type UpdateTicketMutationVariables = Exact<{
  input: UpdateTicketInput;
}>;


export type UpdateTicketMutation = { __typename?: 'Mutation', updateTicket: { __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any } };

export type DeleteTicketMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTicketMutation = { __typename?: 'Mutation', deleteTicket: { __typename?: 'DeleteTicketResponse', id: number, success: boolean } };

export type TicketUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TicketUpdatedSubscription = { __typename?: 'Subscription', ticketUpdated: { __typename?: 'Ticket', id: number, title: string, description: string, priority: string, status: string, propertyId: number, propertyAddress: string, createdAt: any, updatedAt: any } };

export type ClassifyTicketMutationVariables = Exact<{
  description: Scalars['String']['input'];
}>;


export type ClassifyTicketMutation = { __typename?: 'Mutation', classifyTicket: { __typename?: 'TicketClassification', title: string, priority: string, category: string, estimatedTimeToFix?: string | null, suggestedAction?: string | null } };

export const TicketFieldsFragmentDoc = gql`
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
export const GetPortfolioSummaryDocument = gql`
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
  }
}
    `;

/**
 * __useGetPortfolioSummaryQuery__
 *
 * To run a query within a React component, call `useGetPortfolioSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPortfolioSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPortfolioSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPortfolioSummaryQuery(baseOptions?: Apollo.QueryHookOptions<GetPortfolioSummaryQuery, GetPortfolioSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPortfolioSummaryQuery, GetPortfolioSummaryQueryVariables>(GetPortfolioSummaryDocument, options);
      }
export function useGetPortfolioSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPortfolioSummaryQuery, GetPortfolioSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPortfolioSummaryQuery, GetPortfolioSummaryQueryVariables>(GetPortfolioSummaryDocument, options);
        }
export function useGetPortfolioSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPortfolioSummaryQuery, GetPortfolioSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPortfolioSummaryQuery, GetPortfolioSummaryQueryVariables>(GetPortfolioSummaryDocument, options);
        }
export type GetPortfolioSummaryQueryHookResult = ReturnType<typeof useGetPortfolioSummaryQuery>;
export type GetPortfolioSummaryLazyQueryHookResult = ReturnType<typeof useGetPortfolioSummaryLazyQuery>;
export type GetPortfolioSummarySuspenseQueryHookResult = ReturnType<typeof useGetPortfolioSummarySuspenseQuery>;
export type GetPortfolioSummaryQueryResult = Apollo.QueryResult<GetPortfolioSummaryQuery, GetPortfolioSummaryQueryVariables>;
export const AllocateFundsDocument = gql`
    mutation AllocateFunds($input: AllocateFundsInput!) {
  allocateFunds(input: $input) {
    success
    message
    investmentId
  }
}
    `;
export type AllocateFundsMutationFn = Apollo.MutationFunction<AllocateFundsMutation, AllocateFundsMutationVariables>;

/**
 * __useAllocateFundsMutation__
 *
 * To run a mutation, you first call `useAllocateFundsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAllocateFundsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [allocateFundsMutation, { data, loading, error }] = useAllocateFundsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAllocateFundsMutation(baseOptions?: Apollo.MutationHookOptions<AllocateFundsMutation, AllocateFundsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AllocateFundsMutation, AllocateFundsMutationVariables>(AllocateFundsDocument, options);
      }
export type AllocateFundsMutationHookResult = ReturnType<typeof useAllocateFundsMutation>;
export type AllocateFundsMutationResult = Apollo.MutationResult<AllocateFundsMutation>;
export type AllocateFundsMutationOptions = Apollo.BaseMutationOptions<AllocateFundsMutation, AllocateFundsMutationVariables>;
export const GetInvestmentOptionsDocument = gql`
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

/**
 * __useGetInvestmentOptionsQuery__
 *
 * To run a query within a React component, call `useGetInvestmentOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvestmentOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvestmentOptionsQuery({
 *   variables: {
 *      surplusCash: // value for 'surplusCash'
 *      riskProfile: // value for 'riskProfile'
 *   },
 * });
 */
export function useGetInvestmentOptionsQuery(baseOptions: Apollo.QueryHookOptions<GetInvestmentOptionsQuery, GetInvestmentOptionsQueryVariables> & ({ variables: GetInvestmentOptionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvestmentOptionsQuery, GetInvestmentOptionsQueryVariables>(GetInvestmentOptionsDocument, options);
      }
export function useGetInvestmentOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvestmentOptionsQuery, GetInvestmentOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvestmentOptionsQuery, GetInvestmentOptionsQueryVariables>(GetInvestmentOptionsDocument, options);
        }
export function useGetInvestmentOptionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvestmentOptionsQuery, GetInvestmentOptionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvestmentOptionsQuery, GetInvestmentOptionsQueryVariables>(GetInvestmentOptionsDocument, options);
        }
export type GetInvestmentOptionsQueryHookResult = ReturnType<typeof useGetInvestmentOptionsQuery>;
export type GetInvestmentOptionsLazyQueryHookResult = ReturnType<typeof useGetInvestmentOptionsLazyQuery>;
export type GetInvestmentOptionsSuspenseQueryHookResult = ReturnType<typeof useGetInvestmentOptionsSuspenseQuery>;
export type GetInvestmentOptionsQueryResult = Apollo.QueryResult<GetInvestmentOptionsQuery, GetInvestmentOptionsQueryVariables>;
export const GetHistoricalReturnsDocument = gql`
    query GetHistoricalReturns {
  historicalReturns {
    date
    value
  }
}
    `;

/**
 * __useGetHistoricalReturnsQuery__
 *
 * To run a query within a React component, call `useGetHistoricalReturnsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHistoricalReturnsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHistoricalReturnsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHistoricalReturnsQuery(baseOptions?: Apollo.QueryHookOptions<GetHistoricalReturnsQuery, GetHistoricalReturnsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHistoricalReturnsQuery, GetHistoricalReturnsQueryVariables>(GetHistoricalReturnsDocument, options);
      }
export function useGetHistoricalReturnsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHistoricalReturnsQuery, GetHistoricalReturnsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHistoricalReturnsQuery, GetHistoricalReturnsQueryVariables>(GetHistoricalReturnsDocument, options);
        }
export function useGetHistoricalReturnsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetHistoricalReturnsQuery, GetHistoricalReturnsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetHistoricalReturnsQuery, GetHistoricalReturnsQueryVariables>(GetHistoricalReturnsDocument, options);
        }
export type GetHistoricalReturnsQueryHookResult = ReturnType<typeof useGetHistoricalReturnsQuery>;
export type GetHistoricalReturnsLazyQueryHookResult = ReturnType<typeof useGetHistoricalReturnsLazyQuery>;
export type GetHistoricalReturnsSuspenseQueryHookResult = ReturnType<typeof useGetHistoricalReturnsSuspenseQuery>;
export type GetHistoricalReturnsQueryResult = Apollo.QueryResult<GetHistoricalReturnsQuery, GetHistoricalReturnsQueryVariables>;
export const GetPropertiesDocument = gql`
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

/**
 * __useGetPropertiesQuery__
 *
 * To run a query within a React component, call `useGetPropertiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPropertiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPropertiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPropertiesQuery(baseOptions?: Apollo.QueryHookOptions<GetPropertiesQuery, GetPropertiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPropertiesQuery, GetPropertiesQueryVariables>(GetPropertiesDocument, options);
      }
export function useGetPropertiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPropertiesQuery, GetPropertiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPropertiesQuery, GetPropertiesQueryVariables>(GetPropertiesDocument, options);
        }
export function useGetPropertiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPropertiesQuery, GetPropertiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPropertiesQuery, GetPropertiesQueryVariables>(GetPropertiesDocument, options);
        }
export type GetPropertiesQueryHookResult = ReturnType<typeof useGetPropertiesQuery>;
export type GetPropertiesLazyQueryHookResult = ReturnType<typeof useGetPropertiesLazyQuery>;
export type GetPropertiesSuspenseQueryHookResult = ReturnType<typeof useGetPropertiesSuspenseQuery>;
export type GetPropertiesQueryResult = Apollo.QueryResult<GetPropertiesQuery, GetPropertiesQueryVariables>;
export const GetPropertyDocument = gql`
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

/**
 * __useGetPropertyQuery__
 *
 * To run a query within a React component, call `useGetPropertyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPropertyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPropertyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPropertyQuery(baseOptions: Apollo.QueryHookOptions<GetPropertyQuery, GetPropertyQueryVariables> & ({ variables: GetPropertyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPropertyQuery, GetPropertyQueryVariables>(GetPropertyDocument, options);
      }
export function useGetPropertyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPropertyQuery, GetPropertyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPropertyQuery, GetPropertyQueryVariables>(GetPropertyDocument, options);
        }
export function useGetPropertySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPropertyQuery, GetPropertyQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPropertyQuery, GetPropertyQueryVariables>(GetPropertyDocument, options);
        }
export type GetPropertyQueryHookResult = ReturnType<typeof useGetPropertyQuery>;
export type GetPropertyLazyQueryHookResult = ReturnType<typeof useGetPropertyLazyQuery>;
export type GetPropertySuspenseQueryHookResult = ReturnType<typeof useGetPropertySuspenseQuery>;
export type GetPropertyQueryResult = Apollo.QueryResult<GetPropertyQuery, GetPropertyQueryVariables>;
export const GetDashboardStatsDocument = gql`
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

/**
 * __useGetDashboardStatsQuery__
 *
 * To run a query within a React component, call `useGetDashboardStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDashboardStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDashboardStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDashboardStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
      }
export function useGetDashboardStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
        }
export function useGetDashboardStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
        }
export type GetDashboardStatsQueryHookResult = ReturnType<typeof useGetDashboardStatsQuery>;
export type GetDashboardStatsLazyQueryHookResult = ReturnType<typeof useGetDashboardStatsLazyQuery>;
export type GetDashboardStatsSuspenseQueryHookResult = ReturnType<typeof useGetDashboardStatsSuspenseQuery>;
export type GetDashboardStatsQueryResult = Apollo.QueryResult<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>;
export const GetMonthlyIncomeDocument = gql`
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

/**
 * __useGetMonthlyIncomeQuery__
 *
 * To run a query within a React component, call `useGetMonthlyIncomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMonthlyIncomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMonthlyIncomeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMonthlyIncomeQuery(baseOptions?: Apollo.QueryHookOptions<GetMonthlyIncomeQuery, GetMonthlyIncomeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMonthlyIncomeQuery, GetMonthlyIncomeQueryVariables>(GetMonthlyIncomeDocument, options);
      }
export function useGetMonthlyIncomeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMonthlyIncomeQuery, GetMonthlyIncomeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMonthlyIncomeQuery, GetMonthlyIncomeQueryVariables>(GetMonthlyIncomeDocument, options);
        }
export function useGetMonthlyIncomeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMonthlyIncomeQuery, GetMonthlyIncomeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMonthlyIncomeQuery, GetMonthlyIncomeQueryVariables>(GetMonthlyIncomeDocument, options);
        }
export type GetMonthlyIncomeQueryHookResult = ReturnType<typeof useGetMonthlyIncomeQuery>;
export type GetMonthlyIncomeLazyQueryHookResult = ReturnType<typeof useGetMonthlyIncomeLazyQuery>;
export type GetMonthlyIncomeSuspenseQueryHookResult = ReturnType<typeof useGetMonthlyIncomeSuspenseQuery>;
export type GetMonthlyIncomeQueryResult = Apollo.QueryResult<GetMonthlyIncomeQuery, GetMonthlyIncomeQueryVariables>;
export const GetOpenTicketsDocument = gql`
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

/**
 * __useGetOpenTicketsQuery__
 *
 * To run a query within a React component, call `useGetOpenTicketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpenTicketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpenTicketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOpenTicketsQuery(baseOptions?: Apollo.QueryHookOptions<GetOpenTicketsQuery, GetOpenTicketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOpenTicketsQuery, GetOpenTicketsQueryVariables>(GetOpenTicketsDocument, options);
      }
export function useGetOpenTicketsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOpenTicketsQuery, GetOpenTicketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOpenTicketsQuery, GetOpenTicketsQueryVariables>(GetOpenTicketsDocument, options);
        }
export function useGetOpenTicketsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOpenTicketsQuery, GetOpenTicketsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOpenTicketsQuery, GetOpenTicketsQueryVariables>(GetOpenTicketsDocument, options);
        }
export type GetOpenTicketsQueryHookResult = ReturnType<typeof useGetOpenTicketsQuery>;
export type GetOpenTicketsLazyQueryHookResult = ReturnType<typeof useGetOpenTicketsLazyQuery>;
export type GetOpenTicketsSuspenseQueryHookResult = ReturnType<typeof useGetOpenTicketsSuspenseQuery>;
export type GetOpenTicketsQueryResult = Apollo.QueryResult<GetOpenTicketsQuery, GetOpenTicketsQueryVariables>;
export const GetUpcomingLeasesDocument = gql`
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

/**
 * __useGetUpcomingLeasesQuery__
 *
 * To run a query within a React component, call `useGetUpcomingLeasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUpcomingLeasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUpcomingLeasesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUpcomingLeasesQuery(baseOptions?: Apollo.QueryHookOptions<GetUpcomingLeasesQuery, GetUpcomingLeasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUpcomingLeasesQuery, GetUpcomingLeasesQueryVariables>(GetUpcomingLeasesDocument, options);
      }
export function useGetUpcomingLeasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUpcomingLeasesQuery, GetUpcomingLeasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUpcomingLeasesQuery, GetUpcomingLeasesQueryVariables>(GetUpcomingLeasesDocument, options);
        }
export function useGetUpcomingLeasesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUpcomingLeasesQuery, GetUpcomingLeasesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUpcomingLeasesQuery, GetUpcomingLeasesQueryVariables>(GetUpcomingLeasesDocument, options);
        }
export type GetUpcomingLeasesQueryHookResult = ReturnType<typeof useGetUpcomingLeasesQuery>;
export type GetUpcomingLeasesLazyQueryHookResult = ReturnType<typeof useGetUpcomingLeasesLazyQuery>;
export type GetUpcomingLeasesSuspenseQueryHookResult = ReturnType<typeof useGetUpcomingLeasesSuspenseQuery>;
export type GetUpcomingLeasesQueryResult = Apollo.QueryResult<GetUpcomingLeasesQuery, GetUpcomingLeasesQueryVariables>;
export const OnTicketUpdatedDocument = gql`
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

/**
 * __useOnTicketUpdatedSubscription__
 *
 * To run a query within a React component, call `useOnTicketUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnTicketUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnTicketUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnTicketUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnTicketUpdatedSubscription, OnTicketUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnTicketUpdatedSubscription, OnTicketUpdatedSubscriptionVariables>(OnTicketUpdatedDocument, options);
      }
export type OnTicketUpdatedSubscriptionHookResult = ReturnType<typeof useOnTicketUpdatedSubscription>;
export type OnTicketUpdatedSubscriptionResult = Apollo.SubscriptionResult<OnTicketUpdatedSubscription>;
export const OnTicketCreatedDocument = gql`
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

/**
 * __useOnTicketCreatedSubscription__
 *
 * To run a query within a React component, call `useOnTicketCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnTicketCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnTicketCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnTicketCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnTicketCreatedSubscription, OnTicketCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnTicketCreatedSubscription, OnTicketCreatedSubscriptionVariables>(OnTicketCreatedDocument, options);
      }
export type OnTicketCreatedSubscriptionHookResult = ReturnType<typeof useOnTicketCreatedSubscription>;
export type OnTicketCreatedSubscriptionResult = Apollo.SubscriptionResult<OnTicketCreatedSubscription>;
export const OnTicketDeletedDocument = gql`
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

/**
 * __useOnTicketDeletedSubscription__
 *
 * To run a query within a React component, call `useOnTicketDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnTicketDeletedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnTicketDeletedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnTicketDeletedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnTicketDeletedSubscription, OnTicketDeletedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnTicketDeletedSubscription, OnTicketDeletedSubscriptionVariables>(OnTicketDeletedDocument, options);
      }
export type OnTicketDeletedSubscriptionHookResult = ReturnType<typeof useOnTicketDeletedSubscription>;
export type OnTicketDeletedSubscriptionResult = Apollo.SubscriptionResult<OnTicketDeletedSubscription>;
export const GetTicketsDocument = gql`
    query GetTickets($filters: TicketFiltersInput) {
  tickets(filters: $filters) {
    ...TicketFields
  }
}
    ${TicketFieldsFragmentDoc}`;

/**
 * __useGetTicketsQuery__
 *
 * To run a query within a React component, call `useGetTicketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTicketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTicketsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetTicketsQuery(baseOptions?: Apollo.QueryHookOptions<GetTicketsQuery, GetTicketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTicketsQuery, GetTicketsQueryVariables>(GetTicketsDocument, options);
      }
export function useGetTicketsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTicketsQuery, GetTicketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTicketsQuery, GetTicketsQueryVariables>(GetTicketsDocument, options);
        }
export function useGetTicketsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTicketsQuery, GetTicketsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTicketsQuery, GetTicketsQueryVariables>(GetTicketsDocument, options);
        }
export type GetTicketsQueryHookResult = ReturnType<typeof useGetTicketsQuery>;
export type GetTicketsLazyQueryHookResult = ReturnType<typeof useGetTicketsLazyQuery>;
export type GetTicketsSuspenseQueryHookResult = ReturnType<typeof useGetTicketsSuspenseQuery>;
export type GetTicketsQueryResult = Apollo.QueryResult<GetTicketsQuery, GetTicketsQueryVariables>;
export const GetTicketDocument = gql`
    query GetTicket($id: Int!) {
  ticket(id: $id) {
    ...TicketFields
  }
}
    ${TicketFieldsFragmentDoc}`;

/**
 * __useGetTicketQuery__
 *
 * To run a query within a React component, call `useGetTicketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTicketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTicketQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTicketQuery(baseOptions: Apollo.QueryHookOptions<GetTicketQuery, GetTicketQueryVariables> & ({ variables: GetTicketQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTicketQuery, GetTicketQueryVariables>(GetTicketDocument, options);
      }
export function useGetTicketLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTicketQuery, GetTicketQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTicketQuery, GetTicketQueryVariables>(GetTicketDocument, options);
        }
export function useGetTicketSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTicketQuery, GetTicketQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTicketQuery, GetTicketQueryVariables>(GetTicketDocument, options);
        }
export type GetTicketQueryHookResult = ReturnType<typeof useGetTicketQuery>;
export type GetTicketLazyQueryHookResult = ReturnType<typeof useGetTicketLazyQuery>;
export type GetTicketSuspenseQueryHookResult = ReturnType<typeof useGetTicketSuspenseQuery>;
export type GetTicketQueryResult = Apollo.QueryResult<GetTicketQuery, GetTicketQueryVariables>;
export const CreateTicketDocument = gql`
    mutation CreateTicket($input: CreateTicketInput!) {
  createTicket(input: $input) {
    ...TicketFields
  }
}
    ${TicketFieldsFragmentDoc}`;
export type CreateTicketMutationFn = Apollo.MutationFunction<CreateTicketMutation, CreateTicketMutationVariables>;

/**
 * __useCreateTicketMutation__
 *
 * To run a mutation, you first call `useCreateTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTicketMutation, { data, loading, error }] = useCreateTicketMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTicketMutation(baseOptions?: Apollo.MutationHookOptions<CreateTicketMutation, CreateTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTicketMutation, CreateTicketMutationVariables>(CreateTicketDocument, options);
      }
export type CreateTicketMutationHookResult = ReturnType<typeof useCreateTicketMutation>;
export type CreateTicketMutationResult = Apollo.MutationResult<CreateTicketMutation>;
export type CreateTicketMutationOptions = Apollo.BaseMutationOptions<CreateTicketMutation, CreateTicketMutationVariables>;
export const UpdateTicketDocument = gql`
    mutation UpdateTicket($input: UpdateTicketInput!) {
  updateTicket(input: $input) {
    ...TicketFields
  }
}
    ${TicketFieldsFragmentDoc}`;
export type UpdateTicketMutationFn = Apollo.MutationFunction<UpdateTicketMutation, UpdateTicketMutationVariables>;

/**
 * __useUpdateTicketMutation__
 *
 * To run a mutation, you first call `useUpdateTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTicketMutation, { data, loading, error }] = useUpdateTicketMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTicketMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTicketMutation, UpdateTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTicketMutation, UpdateTicketMutationVariables>(UpdateTicketDocument, options);
      }
export type UpdateTicketMutationHookResult = ReturnType<typeof useUpdateTicketMutation>;
export type UpdateTicketMutationResult = Apollo.MutationResult<UpdateTicketMutation>;
export type UpdateTicketMutationOptions = Apollo.BaseMutationOptions<UpdateTicketMutation, UpdateTicketMutationVariables>;
export const DeleteTicketDocument = gql`
    mutation DeleteTicket($id: Int!) {
  deleteTicket(id: $id) {
    id
    success
  }
}
    `;
export type DeleteTicketMutationFn = Apollo.MutationFunction<DeleteTicketMutation, DeleteTicketMutationVariables>;

/**
 * __useDeleteTicketMutation__
 *
 * To run a mutation, you first call `useDeleteTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTicketMutation, { data, loading, error }] = useDeleteTicketMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTicketMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTicketMutation, DeleteTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTicketMutation, DeleteTicketMutationVariables>(DeleteTicketDocument, options);
      }
export type DeleteTicketMutationHookResult = ReturnType<typeof useDeleteTicketMutation>;
export type DeleteTicketMutationResult = Apollo.MutationResult<DeleteTicketMutation>;
export type DeleteTicketMutationOptions = Apollo.BaseMutationOptions<DeleteTicketMutation, DeleteTicketMutationVariables>;
export const TicketUpdatedDocument = gql`
    subscription TicketUpdated {
  ticketUpdated {
    ...TicketFields
  }
}
    ${TicketFieldsFragmentDoc}`;

/**
 * __useTicketUpdatedSubscription__
 *
 * To run a query within a React component, call `useTicketUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTicketUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTicketUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TicketUpdatedSubscription, TicketUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TicketUpdatedSubscription, TicketUpdatedSubscriptionVariables>(TicketUpdatedDocument, options);
      }
export type TicketUpdatedSubscriptionHookResult = ReturnType<typeof useTicketUpdatedSubscription>;
export type TicketUpdatedSubscriptionResult = Apollo.SubscriptionResult<TicketUpdatedSubscription>;
export const ClassifyTicketDocument = gql`
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
export type ClassifyTicketMutationFn = Apollo.MutationFunction<ClassifyTicketMutation, ClassifyTicketMutationVariables>;

/**
 * __useClassifyTicketMutation__
 *
 * To run a mutation, you first call `useClassifyTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClassifyTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [classifyTicketMutation, { data, loading, error }] = useClassifyTicketMutation({
 *   variables: {
 *      description: // value for 'description'
 *   },
 * });
 */
export function useClassifyTicketMutation(baseOptions?: Apollo.MutationHookOptions<ClassifyTicketMutation, ClassifyTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClassifyTicketMutation, ClassifyTicketMutationVariables>(ClassifyTicketDocument, options);
      }
export type ClassifyTicketMutationHookResult = ReturnType<typeof useClassifyTicketMutation>;
export type ClassifyTicketMutationResult = Apollo.MutationResult<ClassifyTicketMutation>;
export type ClassifyTicketMutationOptions = Apollo.BaseMutationOptions<ClassifyTicketMutation, ClassifyTicketMutationVariables>;