#!/bin/bash

echo "🚀 Starting Steve - AI Health Assistant"
echo "========================================"

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "npm run dev"
pkill -f "npm start"
sleep 2

# Start backend
echo "🔧 Starting backend server..."
cd afya-quest-backend
PORT=8080 npm run dev &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Test if backend is running
echo "🔍 Testing backend connection..."
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend server..."
cd ../afya-quest-frontend
PORT=3001 npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "🎉 Steve is ready!"
echo "📱 Frontend: http://localhost:3001"
echo "🔧 Backend: http://localhost:8080"
echo "💬 Look for the chat button in the bottom-left corner"
echo ""
echo "Press Ctrl+C to stop both servers"

# Keep script running and handle shutdown
trap 'echo "🛑 Shutting down servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
