#!/bin/bash

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

# Start API server with database preparation
cd api
echo "Generating Prisma client..."
npx prisma generate

echo "Checking database status..."
if [ ! -f "prisma/dev.db" ]; then
  echo "Creating database and running migrations..."
  npx prisma migrate dev --name init

  echo "Seeding the database with test data..."
  npm run prisma:seed
fi

echo "Starting API server on port 5001..."
npm run start:dev &
API_PID=$!
cd ..

# Start client server
cd client
echo "Starting client server on port 3000..."
npm run dev &
CLIENT_PID=$!
cd ..

echo "Both servers are running."
echo "API: http://localhost:5001/graphql"
echo "Client: http://localhost:3000"
echo "Press Ctrl+C to stop."

# Wait for user to press Ctrl+C
wait