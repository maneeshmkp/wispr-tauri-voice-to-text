@echo off
REM Quick setup script for Wispr Desktop App

echo.
echo 🎤 Wispr Desktop App - Quick Setup
echo ==================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

REM Check Rust
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Rust is not installed. Please install it from https://rustup.rs/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('rustc --version') do set RUST_VERSION=%%i
echo ✅ Rust found: %RUST_VERSION%

echo.
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo.
echo 🔧 Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file
    echo ⚠️  Please edit .env and add your Deepgram API key
) else (
    echo ✅ .env file already exists
)

echo.
echo 🚀 Ready to run!
echo.
echo For development mode, run:
echo   npm run tauri:dev
echo.
echo For production build, run:
echo   npm run tauri:build
echo.
pause
