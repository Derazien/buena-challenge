# Buena-Style Property Owner MVP

A lightweight, web-first prototype that proves two high-impact, manager-free workflows for small property owners:
- Rent-Reinvest Wizard – automatically channels surplus rent into suitable, low-friction investment instruments.
- AI Ticket Triage – classifies incoming tenant issues and generates maintenance tickets without human intervention.

The goal is to showcase how Buena's clean UI/UX and modern SaaS stack can be extended to eliminate the middle-man property manager.

## Project Structure

The project consists of two main parts:
- `client/`: Next.js 14 frontend with TypeScript and Tailwind CSS
- `api/`: Nest.js API with GraphQL, Prisma, and Llama AI integration

## Prerequisites

- Node.js 18+ (LTS)
- npm or pnpm
- Docker (optional, for Ollama)
- Ollama with Llama 3 8B model (optional, for AI features)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install API dependencies and set up the database

```bash
cd api
npm install
npx prisma migrate dev --name init
npm run prisma:seed
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Run Ollama (Optional, for AI features)

If you want to use the AI features, you need to run Ollama with the Llama 3 model:

```bash
ollama run llama3:8b
```

### 5. Start the API server

```bash
cd ../api
npm run start:dev
```

The API will be available at http://localhost:3000

### 6. Start the client

```bash
cd ../client
npm run dev
```

The client will be available at http://localhost:3001

## Features

### Dashboard

- Monthly Income Card showing rental income and expenses
- Open Tickets Card showing maintenance issues
- Upcoming Lease Renewals Card

### Rent-Reinvest Wizard

A three-step wizard that helps property owners reinvest surplus cash:
1. Enter Surplus Cash
2. Choose Risk Profile
3. Review AI-Suggested Investments

### AI Ticket Triage

- View and filter maintenance tickets
- Create new tickets with AI classification
- Manage and update ticket status

## Technologies Used

- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Nest.js 10, TypeScript, GraphQL, Prisma
- **Database**: SQLite (dev), can be easily switched to PostgreSQL for production
- **AI**: Llama 3 8B via Ollama REST API

## Deployment

For the demo, the frontend can be deployed to Vercel and the API to Railway.

## Next Steps

- Swap SQLite for Postgres by changing one line in schema.prisma and running prisma migrate dev
- Add Lease-Renewal Autopilot and Maintenance Scheduling flows as phase 2
- Implement real-time updates for tickets using GraphQL subscriptions