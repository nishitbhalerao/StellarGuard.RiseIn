#!/bin/bash

echo "🚀 Installing StellarGuard..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create .env files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB: mongod"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: npm run dev"
echo "4. Visit http://localhost:5173"
echo ""
echo "For Soroban contract deployment, see DEPLOYMENT.md"
