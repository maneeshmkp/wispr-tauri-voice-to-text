#!/bin/bash
# Quick setup script for Wispr Desktop App

echo "🎤 Wispr Desktop App - Quick Setup"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed. Please install it from https://rustup.rs/"
    exit 1
fi
echo "✅ Rust found: $(rustc --version)"

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your Deepgram API key"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🚀 Ready to run!"
echo ""
echo "For development mode, run:"
echo "  npm run tauri:dev"
echo ""
echo "For production build, run:"
echo "  npm run tauri:build"
echo ""
