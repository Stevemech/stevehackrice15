#!/bin/bash

echo "🚀 Starting Afya Quest Development Environment..."
echo ""

# Check if MongoDB is running
if ! pgrep -f mongod > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    exit 1
fi

echo "✅ MongoDB is running"

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend Server (port 5000)..."
    cd afya-quest-backend
    npm start &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server (port 3000)..."
    cd afya-quest-frontend
    npm start &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
}

# Start both services
start_backend
sleep 3
start_frontend

echo ""
echo "🎉 Afya Quest is starting up!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "👀 Demo Credentials:"
echo "   Email: demo@afyaquest.com"
echo "   Password: demo123"
echo ""
echo "⏹️  To stop: Press Ctrl+C or run: killall node"

# Wait for user interruption
wait