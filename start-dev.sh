#!/bin/bash

set -e

# Function to stop servers on exit
function cleanup {
  echo "Stopping servers..."
  if [ ! -z "$API_PID" ]; then
    kill $API_PID
  fi
  if [ ! -z "$CLIENT_PID" ]; then
    kill $CLIENT_PID
  fi
  exit
}

# Register the cleanup function for when script exits
trap cleanup EXIT INT TERM

cd "$(dirname "$0")"

# Step 1: Install dependencies for API
if [ ! -d "api/node_modules" ]; then
  echo "Installing API dependencies..."
  cd api
  npm install || exit 1
  cd ..
else
  echo "API dependencies already installed."
fi

# Step 2: Install dependencies for Client
if [ ! -d "client/node_modules" ]; then
  echo "Installing Client dependencies..."
  cd client
  npm install || exit 1
  cd ..
else
  echo "Client dependencies already installed."
fi

# Step 3: Prisma generate, migrate, and seed
cd api
npx prisma generate || exit 1
npx prisma migrate dev --name start_dev_sync --skip-seed || exit 1
if [ -f "prisma/seed.ts" ]; then
  echo "Seeding the database with test data..."
  npm run prisma:seed || exit 1
else
  echo "No seed script found, skipping seeding."
fi
cd ..

# Step 4: GraphQL codegen for client
cd client
if [ -f "codegen.ts" ]; then
  echo "Running GraphQL codegen..."
  npm run codegen || exit 1
else
  echo "No codegen.ts found, skipping codegen."
fi
cd ..

# Step 5: Start API and Client in parallel
cd api && npm run start:dev &
API_PID=$!
cd ../client && npm run dev &
CLIENT_PID=$!
cd ..

echo "\nAll services started. API on port 5001, Client on port 3001."
echo "Press Ctrl+C to stop all processes."

wait