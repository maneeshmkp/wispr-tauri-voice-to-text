# Wispr Development Instructions

This file contains development and setup instructions for the Wispr desktop application.

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Deepgram API key
   ```

3. **Run Development Server**
   ```bash
   npm run tauri:dev
   ```

## Development Commands

- `npm run tauri:dev` - Run app in development mode
- `npm run tauri:build` - Build for production
- `npm run build` - Build frontend only
- `npm run dev` - Start Vite dev server

## Frontend Architecture

### App.jsx
Main React component that manages:
- Recording state management
- Audio capture via MediaRecorder
- WebM to WAV conversion
- Deepgram API communication
- Error handling

### Components
- **RecordingPanel.jsx** - Start/Stop buttons and recording timer
- **TranscriptionPanel.jsx** - Display transcribed text and copy button

## Audio Processing Flow

1. **Capture**: MediaRecorder captures WebM audio
2. **Convert**: AudioContext decodes WebM and encodes to WAV
3. **Send**: FormData blob sent to Deepgram with Authorization header
4. **Parse**: Response JSON parsed to extract transcript
5. **Display**: Text rendered in UI

## Deepgram Integration

- Endpoint: `https://api.deepgram.com/v1/listen`
- Model: `nova-2` (latest)
- Language: `en` (English)
- Format: WAV/WebM
- Authentication: Bearer token in Authorization header

## Tauri Backend

The Rust backend in `src-tauri/` is minimal and handles:
- Window creation and management
- App lifecycle
- Security configuration

No additional Rust logic is needed; all heavy lifting is done in the frontend.

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill process on port 5173 (or change in vite.config.js)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Cargo Build Issues
```bash
rustup update
cargo clean
cargo build
```

### Hot Reload Not Working
- Make sure Vite dev server is running
- Check that tauri.conf.json has correct `devUrl`
