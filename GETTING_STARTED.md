# Wispr Desktop App - Getting Started Guide

## 🎯 What is Wispr?

Wispr is a minimal desktop application that records audio from your microphone and automatically converts it to text using Deepgram's advanced speech-to-text AI. It's built with Tauri (Rust), React, and runs natively on your computer.

## ⚡ Quick 5-Minute Setup

### Step 1: Check Prerequisites

Ensure you have installed:
- **Node.js**: [Download](https://nodejs.org/) (v16 or higher)
- **Rust**: [Install](https://rustup.rs/) (for Tauri backend)

Verify installation:
```bash
node --version
npm --version
rustc --version
```

### Step 2: Get Deepgram API Key

1. Visit [deepgram.com](https://deepgram.com/)
2. Sign up for a free account
3. Go to the [Console](https://console.deepgram.com/)
4. Create an API key
5. Copy the key (starts with `dgsk_`)

### Step 3: Install & Configure

```bash
# Navigate to project directory
cd wispr-desktop

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env and paste your API key
# Windows: notepad .env
# macOS/Linux: nano .env
```

**In .env file, change:**
```
VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
```

### Step 4: Run the App

```bash
npm run tauri:dev
```

The Wispr app window will open automatically!

## 🎤 How to Use

1. **Start Recording**: Click the blue "Start Recording" button
   - You'll see a timer counting the recording duration
   - A red pulsing dot indicates active recording

2. **Stop Recording**: Click the red "Stop Recording" button
   - The app shows "Processing..." while transcribing
   - This usually takes a few seconds

3. **View Results**: Your transcribed text appears in the panel below
   - Click "Copy to Clipboard" to copy the text

## 📋 All Commands

```bash
npm run dev              # Run Vite dev server only
npm run build            # Build frontend
npm run tauri:dev        # Run app in dev mode (WITH Tauri)
npm run tauri:build      # Build production app
npm run preview          # Preview production build
```

## 🐛 Troubleshooting

### "Microphone access denied"
- **Windows**: Settings → Privacy & Security → Microphone → Allow
- **macOS**: System Preferences → Security & Privacy → Microphone
- **Linux**: Install PulseAudio: `sudo apt-get install pulseaudio`

### "API key not found"
- Verify `.env` file exists in project root
- Check that `VITE_DEEPGRAM_API_KEY=your_key` has no spaces
- Restart the dev server after editing `.env`

### "Rust compilation error"
```bash
rustup update
cargo clean
npm run tauri:dev
```

### Port 5173 already in use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### App won't start
- Check Node.js version: `node --version` (needs v16+)
- Check Rust: `rustc --version`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 📂 Project Layout

```
wispr-desktop/
├── src/                    ← React frontend code
├── src-tauri/              ← Rust backend
├── package.json            ← Dependencies
├── .env                    ← API key (create from .env.example)
├── README.md               ← Full documentation
└── CONTRIBUTING.md         ← How to contribute
```

## 🏗️ Building for Release

Create installers for distribution:

```bash
npm run tauri:build
```

Find installers in:
- **Windows**: `src-tauri/target/release/bundle/msi/Wispr_0.1.0_x64_en-US.msi`
- **macOS**: `src-tauri/target/release/bundle/dmg/Wispr_0.1.0_x64.dmg`
- **Linux**: `src-tauri/target/release/bundle/appimage/wispr_0.1.0_amd64.AppImage`

## 🔒 Privacy & Security

- ✅ Your audio is sent to Deepgram API
- ✅ API key is never logged or stored (except in .env)
- ✅ No data is stored locally
- ✅ `.env` is in `.gitignore` (won't be committed)
- ✅ Deepgram has privacy policy for data handling

Check [Deepgram Privacy](https://www.deepgram.com/privacy)

## 💡 Tips & Tricks

1. **Clear Audio**: Record in a quiet environment for best results
2. **Duration**: Works best for audio clips 5 seconds to 5 minutes
3. **Microphone**: Make sure your microphone is working in system settings
4. **Language**: Currently set to English. Can be changed in App.jsx
5. **Copy Text**: Double-click text or use Copy button to clipboard
6. **Feedback**: Check browser console (Ctrl+Shift+I) if having issues

## 🎓 Learn More

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Deepgram API Docs](https://developers.deepgram.com/reference)
- [React Documentation](https://react.dev/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 🚀 Next Steps

- [ ] Record your first audio
- [ ] Copy transcription to clipboard
- [ ] Try different accents and languages
- [ ] Share feedback and feature requests
- [ ] Contribute improvements (see CONTRIBUTING.md)

## ❓ FAQ

**Q: Is my microphone data stored?**
A: No. Audio is sent to Deepgram for transcription but not stored by Wispr.

**Q: Can I use this offline?**
A: No, you need internet to reach Deepgram's API.

**Q: What languages are supported?**
A: Default is English, but you can modify the code to support other languages via Deepgram.

**Q: Can I record longer audio?**
A: Yes, up to Deepgram's limit (usually a few hours of audio).

**Q: Is Deepgram free?**
A: Deepgram offers a free tier with monthly limits. See their pricing page.

## 📧 Support

If you encounter issues:
1. Check the [README.md](README.md) for detailed documentation
2. Check [Troubleshooting](#-troubleshooting) section above
3. Open an issue on the repository
4. Check browser console for error messages (F12)

## 🎉 You're Ready!

You now have a fully functional speech-to-text desktop app. Enjoy using Wispr!

---

**Questions?** See the full [README.md](README.md) or [CONTRIBUTING.md](CONTRIBUTING.md)

**Current Version**: 0.1.0  
**Last Updated**: December 2025
