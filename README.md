# Wispr - Desktop Speech-to-Text App

A minimal desktop application for converting speech to text in real-time. Built with Tauri, React, and Deepgram Speech-to-Text API.

## Features

- 🎤 **Audio Recording**: Record audio directly from your microphone
- 🔄 **Real-time Transcription**: Convert audio to text using Deepgram's advanced speech recognition
- 💻 **Desktop App**: Native desktop application using Tauri (works on Windows, macOS, Linux)
- 🛡️ **Permission Handling**: Graceful handling of microphone permission errors
- 📋 **Text Display**: View and copy transcribed text with a single click
- ⚡ **Minimal UI**: Clean, distraction-free interface using Tailwind CSS

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Rust** (for Tauri backend) - [Install Rust](https://rustup.rs/)
- **Deepgram API Key** - [Get a free API key](https://deepgram.com/)

### System Requirements

- Windows 10+, macOS 10.13+, or Linux with GTK 3.0+
- At least 2GB RAM
- Working microphone

## Installation

### 1. Clone the Project

```bash
git clone <repository-url>
cd wispr-desktop
```

### 2. Install Dependencies

```bash
# Install Node dependencies
npm install
```

Tauri's Rust dependencies will be installed automatically when you first run the dev or build command.

### 3. Set Up Deepgram API Key

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Deepgram API key:

```
VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
```

**Important**: Never commit your `.env` file to version control. The `.gitignore` file already excludes it.

### Getting Your Deepgram API Key

1. Visit [Deepgram Console](https://console.deepgram.com/)
2. Sign up or log in to your account
3. Create a new API key in the credentials section
4. Copy the key and paste it into your `.env` file

## How to Run

### Development Mode

Run the app in development mode with hot reload:

```bash
npm run tauri:dev
```

This will:
- Start the Vite dev server
- Build the Tauri backend
- Launch the desktop app window

### Production Build

Create an optimized production build:

```bash
npm run tauri:build
```

The built application will be in `src-tauri/target/release/bundle/`.

## How to Use

1. **Start the App**: Launch the application using the commands above
2. **Click "Start Recording"**: Begin recording audio from your microphone
   - The app will request microphone permission on first use
   - A timer shows the recording duration
3. **Click "Stop Recording"**: Stop the recording and send to Deepgram
   - The app shows "Processing..." while transcribing
4. **View Results**: The transcribed text appears in the transcription panel
5. **Copy Text**: Click "Copy to Clipboard" to copy the transcription

## Project Structure

```
wispr-desktop/
├── src/                      # Frontend React code
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Main app component
│   ├── index.css            # Global styles
│   └── components/          # React components
│       ├── RecordingPanel.jsx
│       └── TranscriptionPanel.jsx
├── src-tauri/               # Tauri Rust backend
│   ├── src/
│   │   └── main.rs          # Rust entry point
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # Tauri configuration
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── package.json             # Node dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## How It Works

### Frontend (React + Vite)

1. **Audio Recording**: Uses the Web Audio API's `MediaRecorder` to capture audio from the microphone
2. **Format Conversion**: Converts WebM audio to WAV format for better compatibility
3. **API Communication**: Sends audio blob to Deepgram API with authentication token

### Backend (Tauri)

The Tauri backend serves as:
- A bridge between the web frontend and native OS APIs
- Provides a secure desktop application container
- Handles window management and native integrations

### Speech-to-Text (Deepgram)

- Receives audio in WAV format
- Uses Deepgram's `nova-2` model for high-accuracy transcription
- Returns JSON response with transcribed text
- Supports real-time streaming (optional enhancement)

## Troubleshooting

### "Microphone permission denied"

- **Windows**: Check Settings → Privacy & Security → Microphone permissions
- **macOS**: Check System Preferences → Security & Privacy → Microphone
- **Linux**: Ensure your user is in the `audio` group: `sudo usermod -aG audio $USER`

### "Deepgram API key not found"

Make sure:
1. You created a `.env` file
2. The API key is set: `VITE_DEEPGRAM_API_KEY=your_key`
3. You restarted the dev server after changing `.env`

### App crashes on start

Ensure Rust is properly installed:
```bash
rustup update
```

### Audio not being recognized

- Try recording for a few seconds with clear speech
- Check your microphone is working in your system settings
- Ensure the audio is in English (default language configured)

## Known Limitations

1. **Language**: Currently configured for English only. Can be extended to support other languages via Deepgram's language models.
2. **Audio Format**: Primarily supports WebM and WAV formats. Other formats may be added.
3. **File Size**: Large audio files (>25 MB) may timeout. Deepgram has processing limits.
4. **Offline**: Requires internet connection for Deepgram API calls.
5. **Storage**: Transcriptions are not persisted between sessions. Add a database for history.
6. **Real-time**: Streaming transcription not implemented. Currently processes complete audio files.

## Environment Variables

Create a `.env` file in the project root with:

```
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
```

| Variable | Description |
|----------|-------------|
| `VITE_DEEPGRAM_API_KEY` | Your Deepgram API key for speech-to-text |

The `VITE_` prefix tells Vite to include this variable in the client build.

## Development

### Available Scripts

```bash
npm run dev           # Start Vite dev server only
npm run build         # Build frontend for production
npm run preview       # Preview production build
npm run tauri         # Show Tauri CLI help
npm run tauri:dev     # Run app in development mode
npm run tauri:build   # Build app for production
```

### Building Installers

After running `npm run tauri:build`, installers are created in:

- **Windows**: `.exe` installer in `src-tauri/target/release/bundle/msi/`
- **macOS**: `.dmg` image in `src-tauri/target/release/bundle/dmg/`
- **Linux**: `.AppImage` in `src-tauri/target/release/bundle/appimage/`

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Desktop**: Tauri v1
- **Speech-to-Text**: Deepgram REST API
- **Audio Capture**: Web Audio API (MediaRecorder)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

## Future Enhancements

- [ ] Multi-language support
- [ ] Audio history and persistence
- [ ] Real-time streaming transcription
- [ ] Multiple output formats (JSON, SRT, etc.)
- [ ] Keyboard shortcuts (Ctrl+R to record)
- [ ] Dark mode
- [ ] Audio playback controls
- [ ] Custom Deepgram model selection
- [ ] Local speech-to-text model integration

## License

This project is open source and available under the MIT License.

## Support & Resources

- [Tauri Documentation](https://tauri.app/)
- [Deepgram Documentation](https://developers.deepgram.com/)
- [React Documentation](https://react.dev/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Version**: 0.1.0  
**Last Updated**: December 2025
