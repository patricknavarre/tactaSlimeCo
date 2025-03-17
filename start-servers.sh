#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Display header
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}   Tacta Slime Server Launcher   ${NC}"
echo -e "${GREEN}==================================${NC}"
echo

# Create a new .env.local file if it doesn't exist yet
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Creating .env.local file from template...${NC}"
  cp .env.local.example .env.local
  echo -e "${GREEN}Created .env.local file. Please edit it with your actual values.${NC}"
fi

# Function to handle Ctrl+C gracefully
trap ctrl_c INT
function ctrl_c() {
  echo
  echo -e "${YELLOW}Stopping all servers...${NC}"
  kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
  exit 0
}

# Start the backend server
echo -e "${BLUE}Starting backend server on port 5051...${NC}"
npm run dev:backend &
BACKEND_PID=$!

# Wait a moment for the backend to initialize
sleep 2

# Start the frontend server
echo -e "${BLUE}Starting frontend server on port 5050...${NC}"
npm run dev:frontend &
FRONTEND_PID=$!

# Display access information
echo
echo -e "${GREEN}Servers started successfully!${NC}"
echo -e "Frontend: ${YELLOW}http://localhost:5050${NC}"
echo -e "Backend:  ${YELLOW}http://localhost:5051${NC}"
echo
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"

# Keep script running until Ctrl+C
wait 