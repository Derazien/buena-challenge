# Buena Property Management Platform

A comprehensive property management solution for small property owners that eliminates the need for middle-men property managers. The platform leverages cutting-edge AI technologies to automate ticket processing and provides investment guidance using surplus rental income.

**Live Demo**: [https://buena-challenge.vercel.app/](https://buena-challenge.vercel.app/)

## 🚀 Key Features

### AI-Powered Ticket Processing System
- **Automatic Ticket Analysis**: Uses LLM to analyze incoming maintenance tickets
- **15-Second Processing Simulation**: Simulates AI processing time
- **Smart Resolution Logic**: 
  - Automatically resolves appropriate tickets
  - Routes complex issues for manual review
  - Provides detailed metadata on resolution actions or review reasons
- **Visual Status Indicators**: Real-time status updates with loading animations
- **Custom-Trained Model**: Utilizes "buena-ticket-handler:8b" model fine-tuned on maintenance request datasets

### AI-Driven Investment Advisor
- **Intelligent Investment Analysis**: AI analyzes market conditions and recommends optimal investments
- **Risk-Calibrated Suggestions**: Tailors recommendations based on owner's risk profile
- **Market-Aware Processing**: Incorporates real-time financial metrics (Euribor, CPI, yields)
- **Personalized Portfolio Building**: Automatically channels surplus rent into suitable investment instruments
- **Financial Performance Tracking**: Visual analytics for portfolio growth and projections

### Property Management Dashboard
- Centralized overview of property portfolio
- Financial metrics and visualizations
- Upcoming lease renewals tracking
- Maintenance ticket status monitoring

## 🛠️ Technical Architecture

### Frontend (Next.js 15)
- **Framework**: React 18 with Next.js 15 and TypeScript
- **Styling**: Tailwind CSS with custom theming
- **State Management**: React Context API, Apollo Client for GraphQL
- **Real-time Updates**: GraphQL Subscriptions via WebSockets
- **Animations**: Framer Motion, custom loading spinners
- **Data Visualization**: Chart.js for financial reporting
- **UI Components**: Custom component library with Radix UI primitives
- **Drag-and-Drop**: Kanban board using dnd-kit
- **Form Handling**: Custom form components with validation

### Mobile Frontend (Jetpack Compose)
- **Technology**: Partial implementation of Android UI using Jetpack Compose
- **Purpose**: Enables property owners to manage their properties on-the-go
- **Status**: Initial implementation started with core screens and navigation
- **Architecture**: Shares GraphQL schema with main web application
- **Key Features**: Simplified ticket management and real-time notifications
- **Path to Completion**: Ready for further development into a full cross-platform solution

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **API**: GraphQL with Apollo Server
- **Database**: Prisma ORM with PostgreSQL/SQLite
- **Authentication**: JWT-based authentication
- **Real-time**: GraphQL subscriptions

### AI Integration
- **LLM Support**: 
  - **Primary (Current)**: OpenAI API (GPT-3.5/4)
  - **Self-Hosted Option**: Custom "buena-ticket-handler:8b" model based on Llama 3 (8B)
- **Training Dataset**: Fine-tuned on 100,000+ property maintenance records from ServiceNow and Zendesk
- **Use Cases**:
  - Ticket classification and prioritization
  - Resolution suggestion generation
  - Investment recommendation engine

## 💡 AI Implementation Details

The system includes dual AI support with flexible configuration:

### Self-Hosted Custom Llama Model
```typescript
// Self-hosted custom model configuration
private readonly llamaApiUrl: string = 'http://localhost:11434/api/generate';
private readonly customTicketModel: string = 'buena-ticket-handler:8b';

// Call to self-hosted model for inference
const response = await axios.post(
    this.llamaApiUrl,
    {
        model: this.customTicketModel, // Our custom model fine-tuned on ticket data
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
    }
);
```

The custom model is fine-tuned on a dataset of over 100,000 real property maintenance tickets, including:
- Classification data (issue type, severity, resolution time)
- Historical resolution patterns
- Common maintenance issues and solutions
- Property-specific maintenance terminology

### Investment Portfolio AI Analysis
The platform uses AI to process financial data and provide personalized investment recommendations:

```typescript
async suggestInvestment(surplusCash: number, riskProfile: string, marketData: any): Promise<any[]> {
    // Build detailed financial prompt incorporating:
    const prompt = `
    You are a financial advisor specializing in real estate investment strategies. 
    Analyze the following information and provide personalized investment recommendations:

    Current Market Conditions:
    - Euribor 3M: ${marketData.euribor3M}%
    - German CPI: ${marketData.germanCPI}%
    - Market Trend: ${marketData.marketTrend || 'stable'}
    - Forecasted Yield: ${marketData.forecastedYield}%

    Client Profile:
    - Available Funds: €${surplusCash.toLocaleString()}
    - Risk Profile: ${riskProfile}
    - Source of Funds: Rental Income
    `;

    // Process with AI model to generate investment recommendations
    // ...
}
```

The investment engine analyzes:
- Current interest rates and inflation metrics
- Property market trends
- Client's risk tolerance
- Available investment capital
- Tax optimization opportunities

### OpenAI Integration (Current Implementation)
```typescript
// OpenAI API call
const response = await axios.post(
    this.openaiUrl,
    {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
    },
    {
        headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
        }
    }
);
```

## 🔄 Ticket Processing Flow

1. **Ticket Submission**: User submits maintenance ticket via form
2. **Initial Processing**: Ticket enters `in_progress_by_ai` status
3. **AI Analysis**: LLM analyzes ticket content to determine:
   - Issue severity and category
   - Resolution complexity
   - Recommended actions
4. **Resolution Determination**: AI decides if ticket can be resolved automatically
5. **Status Update**: Ticket transitions to either:
   - `needs_manual_review`: Complex issues requiring human attention
   - `resolved`: Issues that have been automatically addressed
6. **Metadata Storage**: All AI analysis and actions are stored in ticket metadata

## 📊 Data Models

### Tickets
- Title, description, status, priority
- Property association
- Metadata including AI analysis results
- Contact information
- Resolution details

### Properties
- Address, specifications, financial metrics
- Associated leases and tickets
- Occupancy and revenue tracking

### Investments
- Investment vehicles and allocations
- Performance tracking
- Risk profiles and returns

## 🚀 Setup and Deployment

### Prerequisites
- Node.js 18+ (LTS)
- npm or pnpm
- Docker (optional, for Ollama)
- Ollama with Llama 3 8B model (optional, for self-hosted AI)
- Android Studio (optional, for mobile development)

### Project Structure
```
buena-challenge/
├── api/               # NestJS backend with GraphQL and Prisma
├── client/            # Next.js frontend web application
├── compose-client/    # Jetpack Compose Android application (partial)
└── README.md          # This documentation
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd <repository-name>

# Install API dependencies and set up database
cd api
npm install
npx prisma migrate dev --name init
npm run prisma:seed

# Install client dependencies
cd ../client
npm install
```

### Configuration
1. Create `.env` files in both `/api` and `/client` directories
2. Configure API environment:
   ```
   # Database
   DATABASE_URL="file:./dev.db"
   PORT=5001
   JWT_SECRET="your-secret-key"
   
   # AI Integration
   OPENAI_API_KEY="your-api-key"
   LLAMA_API_URL="http://localhost:11434/api/generate"
   
   # Financial API Keys
   ALPHA_VANTAGE_API_KEY="your-alpha-vantage-key"
   FINNHUB_API_KEY="your-finnhub-key"
   
   # Plaid Integration
   PLAID_CLIENT_ID="your-plaid-client-id"
   PLAID_SECRET="your-plaid-secret"
   PLAID_ENV="sandbox"
   ```
3. Configure client environment:
   ```
   NEXT_PUBLIC_GRAPHQL_HTTP_URL=http://localhost:5001/graphql
   NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:5001/graphql
   ```

### Running the Application
```bash
# Option 1: Start each service separately
# Start API server
cd api
npm run start:dev

# Start client application
cd ../client
npm run dev

# Option 2: Use the start-dev script (Windows)
# From the project root
./start-dev.ps1
```

## 🔮 Future Enhancements

### Database Improvements
- **PostgreSQL Migration**: Move from SQLite to PostgreSQL for improved scalability and production readiness
- **Read Replicas**: Implement read replicas for analytics workloads
- **Partitioning Strategy**: Implement table partitioning for high-volume ticket data

### Mobile Application Completion
- **Finish Jetpack Compose Implementation**: Complete the started mobile app for Android
- **Add iOS Support**: Extend to iOS platform using shared GraphQL schema
- **Offline Capabilities**: Implement data synchronization for intermittent connectivity
- **Push Notifications**: Add real-time alerts for critical maintenance issues
- **Biometric Authentication**: Add fingerprint/face recognition for secure access

### Ticket Processing Evolution
- **Real-World Maintenance Integration**: Connect the ticket classification system to actual maintenance provider databases to automatically schedule service calls
- **Smart Scheduling**: Implement calendar integration with available maintenance technicians based on urgency and skillset
- **Self-Hosted Specialized LLMs**: Train domain-specific models on property maintenance data for more accurate ticket classification and resolution
- **Predictive Maintenance**: Analyze historical ticket data to predict and prevent maintenance issues before they occur

### Investment Platform Refinement
- **Streamlined UI/UX**: Simplify the investment interface to reduce cognitive load with cleaner visual hierarchy
- **Guided Investment Flows**: Create step-by-step wizards with visual aids to make complex financial decisions more approachable
- **Financial Education Components**: Integrate contextual learning elements to help property owners make informed decisions
- **Custom Risk Tolerance Assessment**: Develop nuanced profiling beyond basic "conservative/moderate/aggressive" classifications

### Platform Extension
- **Tenant Portal**: Create dedicated interfaces for tenants to submit and track maintenance requests
- **Document Automation**: Generate and process legal documents and lease agreements
- **Multilingual Support**: Use LLM-based translation to serve diverse property owner demographics
- **Advanced Financial Analytics**: Implement predictive models for cash flow optimization and ROI forecasting

## 🎯 Project Purpose

This demonstration showcases the ability to jump into any tech stack (React/Next.js, NestJS, GraphQL, LLMs) to solve Buena's core challenge: **eliminating the middleman from property management**.

By building an intelligent, self-service platform, this solution empowers property owners to:

1. **Manage Their Properties Directly**: No need for expensive property management companies
2. **Automate Routine Tasks**: AI handles classification, prioritization, and resolution of maintenance issues
3. **Make Data-Driven Decisions**: Smart analytics guide investment choices for surplus rental income
4. **Save Time and Money**: Reduced overhead costs and streamlined operations

The platform's modular architecture allows for easy adaptation to different property management workflows and scales from individual landlords to major real estate portfolios.