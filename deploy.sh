#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if necessary tools are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..

echo "🔨 Building frontend..."

# Build frontend
cd client
npm run build
cd ..

echo "✅ Build completed successfully!"

echo "📋 Deployment options:"
echo "1. Deploy to Vercel (Frontend) + Render (Backend)"
echo "2. Deploy to Netlify (Frontend) + Railway (Backend)"
echo "3. Deploy to local server"
echo "4. Deploy to custom VPS"

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel + Render..."
        echo "Please follow these steps:"
        echo "1. Push your code to GitHub"
        echo "2. Connect your repository to Vercel for frontend deployment"
        echo "3. Connect your repository to Render for backend deployment"
        echo "4. Set environment variables in both platforms"
        ;;
    2)
        echo "🚀 Deploying to Netlify + Railway..."
        echo "Please follow these steps:"
        echo "1. Push your code to GitHub"
        echo "2. Connect your repository to Netlify for frontend deployment"
        echo "3. Connect your repository to Railway for backend deployment"
        echo "4. Set environment variables in both platforms"
        ;;
    3)
        echo "🚀 Starting local server..."
        echo "Frontend will be available at: http://localhost:3000"
        echo "Backend will be available at: http://localhost:5000"
        
        # Start backend
        cd server
        npm run dev &
        cd ..
        
        # Start frontend
        cd client
        npm run dev
        ;;
    4)
        echo "🚀 Deploying to custom VPS..."
        echo "Please follow these steps:"
        echo "1. Upload your code to your VPS"
        echo "2. Install Node.js and npm on your VPS"
        echo "3. Run: npm install && npm run build"
        echo "4. Set up a reverse proxy (nginx) to serve the frontend"
        echo "5. Set up PM2 or similar to run the backend"
        ;;
    *)
        echo "❌ Invalid option selected"
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!" 