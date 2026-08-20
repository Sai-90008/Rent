#!/bin/bash
echo "============================================"
echo "  RentPro - Rental Management System"
echo "============================================"

# Check Java
if ! command -v java &> /dev/null; then
    echo "ERROR: Java 17+ is required. Please install it first."
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js 18+ is required. Please install it first."
    exit 1
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven is required. Please install it first."
    exit 1
fi

echo ""
echo "Starting backend (Spring Boot)..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

echo ""
echo "Waiting for backend to start..."
sleep 15

echo ""
echo "Starting frontend (React)..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "============================================"
echo "  Application Started!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
echo "  API Docs: http://localhost:8080/api"
echo "============================================"
echo ""
echo "Default credentials:"
echo "  Username: admin   Password: admin123"
echo "  Username: manager Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
