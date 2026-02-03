#!/bin/bash
# Gated Access System - Installation & Setup Script
# Run this after configuring your .env file

echo "🔐 Gated Access System - Setup"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in backend directory"
    echo ""
    echo "Please create backend/.env with these variables:"
    echo "  GMAIL_USER=your-email@gmail.com"
    echo "  GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx"
    echo "  TWILIO_ACCOUNT_SID=ACxxxxxxxxxx"
    echo "  TWILIO_AUTH_TOKEN=xxxxxxxxxx"
    echo "  TWILIO_PHONE_NUMBER=+1234567890"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ NPM install failed"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Start backend: npm start (in backend folder)"
echo "  2. Visit gated sites:"
echo "     - http://localhost:8000/plasmic.html"
echo "     - http://localhost:8000/cubix.html"
echo "     - http://localhost:8000/fallen-futuristics.html"
echo "     - http://localhost:8000/atlas.html"
echo "     - http://localhost:8000/la-vie.html"
echo "  3. Admin dashboard: http://localhost:8000/gated-access-admin.html"
echo ""
echo "📚 Documentation:"
echo "  - GATED_ACCESS_QUICKSTART.md"
echo "  - GATED_ACCESS_SETUP.md"
echo "  - GATED_ACCESS_SYSTEM_SUMMARY.md"
echo "  - GATED_ACCESS_INDEX.md"
echo ""
echo "Happy coding! 🚀"
