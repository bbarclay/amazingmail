#!/bin/bash

# ============================
# manage_servers.sh
# ============================
# This script manages the frontend and backend npm development servers.
# It allows you to start, stop, and restart both servers,
# while providing real-time feedback and logging all activities.

# Define log files
LOG_FILE="npm_start.log"
FRONTEND_LOG="frontend_output.log"
BACKEND_LOG="backend_output.log"

# Clean up previous log files
rm -f "$LOG_FILE" "$FRONTEND_LOG" "$BACKEND_LOG"

# Redirect all output to both the terminal and the log file
exec > >(tee -a "$LOG_FILE") 2>&1

# ============================
# Function Definitions
# ============================

# Function to check if a process is running given a unique identifier
is_running() {
  local identifier=$1
  pgrep -f "$identifier"
}

# Function to start the frontend development server
start_frontend() {
  local frontend_dir="frontend"
  local identifier="FRONTEND_APP"
  local port=3008

  echo "---- Starting Frontend Development Server ----"

  # Check if frontend is already running
  FRONTEND_PID=$(is_running "$identifier")
  
  if [ -n "$FRONTEND_PID" ]; then
    echo "Frontend dev server is already running with PID: $FRONTEND_PID."
    echo "---------------------------------------------"
    return 0
  fi

  # Navigate to frontend directory
  if ! cd "$frontend_dir"; then
    echo "Error: Failed to navigate to '$frontend_dir' directory."
    echo "---------------------------------------------"
    return 1
  fi

  # Clean previous log file
  rm -f "../$FRONTEND_LOG"

  echo "Running 'npm run dev' in '$frontend_dir' on port $port..."
  # Start 'npm run dev' in background with custom identifier and fixed port
  FRONTEND_PORT=$port FRONTEND_APP=true npm run dev >> "../$FRONTEND_LOG" 2>&1 &
  FRONTEND_PID=$!
  echo "$FRONTEND_PID" > "../frontend_dev.pid"
  echo "Frontend dev server started with PID $FRONTEND_PID."

  # Return to the original directory
  cd - >/dev/null || { echo "Error: Failed to return to the original directory."; return 1; }

  echo "---------------------------------------------"
}

# Function to start the backend development server
start_backend() {
  local backend_dir="backend/api"
  local identifier="BACKEND_APP"
  local port=5008

  echo "---- Starting Backend Development Server ----"

  # Check if backend is already running
  BACKEND_PID=$(is_running "$identifier")
  
  if [ -n "$BACKEND_PID" ]; then
    echo "Backend dev server is already running with PID: $BACKEND_PID."
    echo "---------------------------------------------"
    return 0
  fi

  # Navigate to backend directory
  if ! cd "$backend_dir"; then
    echo "Error: Failed to navigate to '$backend_dir' directory."
    echo "---------------------------------------------"
    return 1
  fi

  # Clean previous log file
  rm -f "../../../$BACKEND_LOG"

  echo "Running 'npm run dev' in '$backend_dir' on port $port..."
  # Start 'npm run dev' in background with custom identifier and fixed port
  BACKEND_PORT=$port BACKEND_APP=true npm run dev >> "../../../$BACKEND_LOG" 2>&1 &
  BACKEND_PID=$!
  echo "$BACKEND_PID" > "../../../backend_dev.pid"
  echo "Backend dev server started with PID $BACKEND_PID."

  # Return to the original directory
  cd - >/dev/null || { echo "Error: Failed to return to the original directory."; return 1; }

  echo "---------------------------------------------"
}

# Function to stop the frontend and backend servers
stop_servers() {
  echo "---- Stopping Frontend and Backend Servers ----"

  # Stop frontend server
  FRONTEND_PID=$(is_running "FRONTEND_APP")
  if [ -n "$FRONTEND_PID" ]; then
    echo "Stopping frontend server with PID $FRONTEND_PID..."
    kill "$FRONTEND_PID" >/dev/null 2>&1
    echo "Frontend server stopped."
  else
    echo "Frontend server is not running."
  fi

  # Remove PID file
  rm -f "frontend_dev.pid"

  # Stop backend server
  BACKEND_PID=$(is_running "BACKEND_APP")
  if [ -n "$BACKEND_PID" ]; then
    echo "Stopping backend server with PID $BACKEND_PID..."
    kill "$BACKEND_PID" >/dev/null 2>&1
    echo "Backend server stopped."
  else
    echo "Backend server is not running."
  fi

  # Remove PID file
  rm -f "backend_dev.pid"

  echo "---------------------------------------------"
}

# Function to display usage instructions
usage() {
  echo "Usage: $0 {start|stop|restart|--start|--stop|--restart}"
  echo "  start|--start    Start both frontend and backend servers."
  echo "  stop|--stop      Stop both frontend and backend servers."
  echo "  restart|--restart Restart both frontend and backend servers."
}

# ============================
# Main Script Execution
# ============================

# Determine the action based on input argument or default to 'start'
ACTION=${1:-start}

echo "===== Managing NPM Development Servers ====="
echo "Action: $ACTION"
echo "Timestamp: $(date)"
echo "---------------------------------------------"

case "$ACTION" in
  start|--start)
    start_frontend
    start_backend
    ;;
  stop|--stop)
    stop_servers
    ;;
  restart|--restart)
    stop_servers
    start_frontend
    start_backend
    ;;
  *)
    echo "Error: Invalid argument."
    usage
    exit 1
    ;;
esac

echo "===== Action Completed at $(date) ====="
echo ""
