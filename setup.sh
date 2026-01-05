#!/bin/bash

# Portfolio Authentication System - Quick Setup

echo "🚀 Portfolio Authentication System - Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Navigate to backend
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "⚙️  Configuration Steps:"
echo "1. Copy .env.example to .env:"
cp .env.example .env
echo "   ✅ Created .env file"

echo ""
echo "2. Update .env with your values:"
echo "   - Firebase credentials"
echo "   - Admin email: frankalfaro105@proton.me"
echo "   - Admin phone: 346-282-1804"
echo "   - Twilio credentials (for SMS)"
echo "   - Email service credentials"
echo "   - Generate ENCRYPTION_KEY and ADMIN_SECRET_KEY"
echo ""
echo "3. Edit .env and fill in your credentials"
echo ""

echo "📝 To generate encryption keys, run:"
echo "node -e \"console.log('ENCRYPTION_KEY:', require('crypto').randomBytes(16).toString('hex'))\" "
echo "node -e \"console.log('ADMIN_SECRET_KEY:', require('crypto').randomBytes(32).toString('hex'))\""
echo ""

echo "🚀 Start the server with:"
echo "npm start"
echo ""

echo "📊 Admin Dashboard will be available at:"
echo "http://localhost:5000/admin"
echo ""

echo "✨ Setup complete! Follow the SETUP_GUIDE.md for detailed instructions."
