# Wispr Architecture & Implementation Guide

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│         Wispr Desktop Application                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Frontend (React + Vite)                     │  │
│  ├──────────────────────────────────────────────┤  │
│  │  • App.jsx - Main component                 │  │
│  │  • RecordingPanel - UI controls             │  │
│  │  • TranscriptionPanel - Display results     │  │
│  │  • Audio Recording via MediaRecorder        │  │
│  │  • WebM → WAV conversion                    │  │
│  │  • State management (useState hooks)        │  │
│  └──────────────────────────────────────────────┘  │
│                     ↓                                │
│  ┌──────────────────────────────────────────────┐  │
│  │  Tauri Bridge                                │  │
│  ├──────────────────────────────────────────────┤  │
│  │  • Window management                        │  │
│  │  • OS integration                           │  │
│  │  • Security configuration                   │  │
│  └──────────────────────────────────────────────┘  │
│                     ↓                                │
│  ┌──────────────────────────────────────────────┐  │
│  │  Backend (Rust)                              │  │
│  ├──────────────────────────────────────────────┤  │
│  │  • Application entry point                  │  │
│  │  • Window creation                          │  │
│  │  • Minimal backend (most logic in frontend) │  │
│  └──────────────────────────────────────────────┘  │
│                     ↓                                │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│     External Services                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Operating System APIs                             │
│  ├─ Microphone Access (getUserMedia)               │
│  └─ Audio Capture (MediaRecorder)                  │
│                                                     │
│  Deepgram API                                      │
│  ├─ Endpoint: https://api.deepgram.com/v1/listen  │
│  ├─ Model: nova-2                                  │
│  ├─ Format: WAV/WebM                              │
│  └─ Authentication: Bearer Token                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Recording Flow
```
User clicks "Start"
        ↓
getUserMedia() - requests microphone access
        ↓
MediaRecorder starts capturing audio (WebM)
        ↓
User clicks "Stop"
        ↓
Audio chunks collected into Blob
        ↓
WebM decoded and re-encoded to WAV format
        ↓
FormData created with audio blob
        ↓
POST request sent to Deepgram with API key
        ↓
Deepgram processes and returns JSON
        ↓
Transcript extracted and displayed
```

## 📝 File Structure & Purpose

### Root Configuration Files
- **package.json** - Node.js dependencies (React, Vite, Tauri)
- **vite.config.js** - Vite build tool configuration
- **tailwind.config.js** - Tailwind CSS theming
- **postcss.config.js** - CSS post-processing
- **.env.example** - Template for environment variables
- **.gitignore** - Files excluded from version control

### Frontend Code (`/src`)
```
src/
├── main.jsx              # React DOM render entry point
├── App.jsx               # Main app component
│   ├── State management  ├─ isRecording
│   │                     ├─ transcription
│   │                     ├─ loading
│   │                     └─ error
│   ├── Event handlers    ├─ startRecording()
│   │                     ├─ stopRecording()
│   │                     ├─ convertWebMToWav()
│   │                     └─ transcribeWithDeepgram()
│   └── Render UI         └─ Layout + Components
├── index.css             # Global styles + Tailwind imports
├── tauri.js              # Tauri integration utilities
└── components/
    ├── RecordingPanel.jsx    # Recording controls + timer
    └── TranscriptionPanel.jsx # Text display + copy button
```

### Backend Code (`/src-tauri`)
```
src-tauri/
├── Cargo.toml            # Rust dependencies (minimal)
├── tauri.conf.json       # Tauri app configuration
├── build.rs              # Build script
└── src/
    └── main.rs           # Rust entry point (minimal code)
```

### Documentation Files
- **README.md** - Complete project documentation
- **GETTING_STARTED.md** - Quick start guide
- **PROJECT_SUMMARY.md** - Project overview
- **CONTRIBUTING.md** - Contribution guidelines
- **setup.sh** / **setup.bat** - Setup automation scripts

## 🎯 Key Implementation Details

### 1. Audio Recording (App.jsx - startRecording)
```javascript
// Request microphone access
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

// Create recorder with WebM format
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm'
})

// Store audio chunks
mediaRecorder.ondataavailable = (event) => {
  audioChunksRef.current.push(event.data)
}

// Start recording
mediaRecorder.start()
```

### 2. Format Conversion (encodeWAV)
```javascript
// Decode WebM using AudioContext
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

// Re-encode to WAV format
// - Write RIFF header
// - Write fmt chunk (PCM, 16-bit)
// - Interleave stereo channels
// - Write audio data

return new Blob([buffer], { type: 'audio/wav' })
```

### 3. Deepgram Integration (transcribeWithDeepgram)
```javascript
// FormData with audio blob
const formData = new FormData()
formData.append('file', audioBlob, 'audio.wav')

// POST to Deepgram with authentication
const response = await fetch(
  'https://api.deepgram.com/v1/listen?model=nova-2&language=en',
  {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`
    },
    body: formData
  }
)

// Extract transcript from response
const transcript = result.results.channels[0].alternatives[0].transcript
```

### 4. React State Management
```javascript
const [isRecording, setIsRecording] = useState(false)        // Recording status
const [transcription, setTranscription] = useState('')       // Result text
const [loading, setLoading] = useState(false)                // Processing indicator
const [error, setError] = useState('')                       // Error message
const mediaRecorderRef = useRef(null)                        // Recorder instance
const audioChunksRef = useRef([])                            // Audio data
```

### 5. UI Components

**RecordingPanel.jsx**
- Displays Start/Stop buttons
- Shows recording timer with minutes:seconds format
- Handles button disabled states
- Visual feedback (red pulsing indicator)

**TranscriptionPanel.jsx**
- Displays transcribed text
- Loading indicator (animated spinner)
- Copy to clipboard functionality
- Scrollable text area for long transcriptions

### 6. Error Handling
- Microphone permission errors (NotAllowedError)
- API key validation
- Deepgram API errors
- Network failures
- Audio conversion errors (graceful fallback to WebM)

## 🔐 Security Considerations

1. **API Key Management**
   - Stored in `.env` file (never committed)
   - Accessed via `import.meta.env.VITE_DEEPGRAM_API_KEY`
   - Vite-only variables prefixed with `VITE_`

2. **Microphone Permissions**
   - Browser permission dialog
   - User must explicitly allow access
   - Permission persists per browser/domain

3. **Audio Data**
   - Only sent to Deepgram for transcription
   - Not stored by Wispr application
   - Subject to Deepgram privacy policy

4. **HTTPS**
   - Deepgram endpoint is HTTPS only
   - Secure communication guaranteed

## 🚀 Performance Optimizations

1. **Lazy Audio Conversion**
   - WAV conversion only when needed
   - Fallback to WebM if conversion fails

2. **Efficient State Management**
   - useRef for non-rendering data (recorder, chunks)
   - useState for UI updates only

3. **Minimal Dependencies**
   - No heavy libraries for audio processing
   - Built-in Web Audio API
   - Core libraries only (React, Tauri)

4. **Asset Loading**
   - Vite tree-shaking removes unused code
   - Code splitting for faster initial load

## 🧪 Testing Checklist

- [ ] Audio recording works
- [ ] Microphone permission handling
- [ ] WebM to WAV conversion
- [ ] Deepgram API communication
- [ ] Transcription display
- [ ] Copy to clipboard
- [ ] Error messages appear
- [ ] Timer displays correctly
- [ ] UI buttons enable/disable appropriately
- [ ] App closes properly
- [ ] Works on Windows, macOS, Linux

## 🔄 Build Process

```
npm install
    ↓
npm run tauri:dev
    ↓
Vite dev server starts (port 5173)
    ↓
Cargo compiles Rust backend
    ↓
Tauri creates app window
    ↓
Frontend loads from dev server
    ↓
App ready for testing
    ↓
Hot reload on file changes
```

## 📦 Dependencies Overview

**Frontend Dependencies:**
- `react@18.2.0` - UI framework
- `react-dom@18.2.0` - React renderer
- `@tauri-apps/api@1.5.3` - Tauri integration
- `@tauri-apps/cli@1.5.11` - Build tool
- `@vitejs/plugin-react@4.2.1` - Vite React support
- `tailwindcss@3.3.6` - CSS framework
- `vite@5.0.8` - Build tool

**Backend Dependencies:**
- `tauri@1.5` - Desktop framework
- `serde` - Serialization
- `serde_json` - JSON handling

**Build Dependencies:**
- `tauri-build@1.5` - Tauri build system
- `autoprefixer@10.4.16` - CSS vendor prefixes
- `postcss@8.4.31` - CSS processing

## 🎓 Code Quality

- **Comments**: Complex logic explained
- **Naming**: Meaningful variable/function names
- **Structure**: Clear separation of concerns
- **Errors**: Comprehensive error handling
- **Standards**: React hooks best practices

## 🔮 Future Enhancements

1. Real-time streaming transcription
2. Multiple language support
3. Audio playback controls
4. Transcription history
5. Custom Deepgram model selection
6. Keyboard shortcuts
7. Dark mode
8. Local ML models (Whisper)

---

This architecture ensures a clean separation between frontend UI (React), desktop integration (Tauri), and external API communication (Deepgram) while maintaining simplicity and performance.
