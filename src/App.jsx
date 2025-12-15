// import { useState, useRef } from 'react'
// import RecordingPanel from './components/RecordingPanel'
// import TranscriptionPanel from './components/TranscriptionPanel'

// function App() {
//   const [isRecording, setIsRecording] = useState(false)
//   const [transcription, setTranscription] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const mediaRecorderRef = useRef(null)
//   const audioChunksRef = useRef([])

//   const startRecording = async () => {
//     try {
//       setError('')
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
//       const mediaRecorder = new MediaRecorder(stream, {
//         mimeType: 'audio/webm'
//       })
      
//       audioChunksRef.current = []
      
//       mediaRecorder.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data)
//       }
      
//       mediaRecorder.onstop = () => {
//         // Stop all tracks
//         stream.getTracks().forEach(track => track.stop())
//       }
      
//       mediaRecorderRef.current = mediaRecorder
//       mediaRecorder.start()
//       setIsRecording(true)
//       setTranscription('')
//     } catch (err) {
//       const errorMessage = err.name === 'NotAllowedError'
//         ? 'Microphone permission denied. Please allow access to your microphone.'
//         : `Error accessing microphone: ${err.message}`
//       setError(errorMessage)
//       console.error('Recording error:', err)
//     }
//   }

//   const stopRecording = async () => {
//     if (!mediaRecorderRef.current) return
    
//     try {
//       setLoading(true)
//       setError('')
      
//       const mediaRecorder = mediaRecorderRef.current
//       mediaRecorder.stop()
//       setIsRecording(false)
      
//       // Wait for the onstop event to complete
//       await new Promise(resolve => {
//         mediaRecorder.onstop = () => {
//           resolve()
//         }
//       })
      
//       // Create audio blob from chunks
//       const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      
//       // Convert to WAV for better Deepgram compatibility
//       const wavBlob = await convertWebMToWav(audioBlob)
      
//       // Send to Deepgram
//       const text = await transcribeWithDeepgram(wavBlob)
//       setTranscription(text)
//       setLoading(false)
//     } catch (err) {
//       setError(`Transcription error: ${err.message}`)
//       setLoading(false)
//       console.error('Transcription error:', err)
//     }
//   }

//   const convertWebMToWav = async (webmBlob) => {
//     // Create an audio context to decode and re-encode
//     const arrayBuffer = await webmBlob.arrayBuffer()
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
//     try {
//       const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
//       return encodeWAV(audioBuffer)
//     } catch (err) {
//       // If decoding fails, return original blob (Deepgram can handle webm)
//       console.warn('WebM to WAV conversion failed, using WebM:', err)
//       return webmBlob
//     }
//   }

//   const encodeWAV = (audioBuffer) => {
//     const numberOfChannels = audioBuffer.numberOfChannels
//     const sampleRate = audioBuffer.sampleRate
//     const format = 1 // PCM
//     const bitDepth = 16

//     let recordedChannels = []
//     for (let channel = 0; channel < numberOfChannels; channel++) {
//       recordedChannels.push(audioBuffer.getChannelData(channel))
//     }

//     let interleaved
//     if (numberOfChannels === 2) {
//       interleaved = interleave(recordedChannels[0], recordedChannels[1])
//     } else {
//       interleaved = recordedChannels[0]
//     }

//     const dataLength = interleaved.length * (bitDepth / 8)
//     const buffer = new ArrayBuffer(44 + dataLength)
//     const view = new DataView(buffer)

//     const writeString = (offset, string) => {
//       for (let i = 0; i < string.length; i++) {
//         view.setUint8(offset + i, string.charCodeAt(i))
//       }
//     }

//     writeString(0, 'RIFF')
//     view.setUint32(4, 36 + dataLength, true)
//     writeString(8, 'WAVE')
//     writeString(12, 'fmt ')
//     view.setUint32(16, 16, true)
//     view.setUint16(20, format, true)
//     view.setUint16(22, numberOfChannels, true)
//     view.setUint32(24, sampleRate, true)
//     view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true)
//     view.setUint16(32, numberOfChannels * (bitDepth / 8), true)
//     view.setUint16(34, bitDepth, true)
//     writeString(36, 'data')
//     view.setUint32(40, dataLength, true)

//     const index = 44
//     const volume = 1
//     let idx = index
//     const samples = interleaved.length
//     while (idx < samples) {
//       const s = Math.max(-1, Math.min(1, interleaved[idx]))
//       view.setInt16(index + idx * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
//       idx++
//     }

//     return new Blob([buffer], { type: 'audio/wav' })
//   }

//   const interleave = (leftChannel, rightChannel) => {
//     const length = leftChannel.length + rightChannel.length
//     const result = new Float32Array(length)

//     let inputIndex = 0
//     for (let index = 0; index < length; index += 2) {
//       result[index] = leftChannel[inputIndex]
//       result[index + 1] = rightChannel[inputIndex]
//       inputIndex++
//     }
//     return result
//   }

//   const transcribeWithDeepgram = async (audioBlob) => {
//     const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY
    
//     if (!apiKey) {
//       throw new Error('Deepgram API key not found. Please set VITE_DEEPGRAM_API_KEY in .env')
//     }

//     const formData = new FormData()
//     formData.append('file', audioBlob, 'audio.wav')

//     const response = await fetch(
//       'https://api.deepgram.com/v1/listen?model=nova-2&language=en',
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${apiKey}`
//         },
//         body: formData
//       }
//     )

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message || 'Deepgram API error')
//     }

//     const result = await response.json()
    
//     // Extract transcription from Deepgram response
//     if (result.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
//       return result.results.channels[0].alternatives[0].transcript
//     }
    
//     throw new Error('No transcription found in response')
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl">
//         <div className="bg-white rounded-lg shadow-xl p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Wispr</h1>
//             <p className="text-gray-600">Convert your speech to text instantly</p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}

//           {/* Recording Section */}
//           <RecordingPanel
//             isRecording={isRecording}
//             loading={loading}
//             onStartRecording={startRecording}
//             onStopRecording={stopRecording}
//           />

//           {/* Transcription Section */}
//           <TranscriptionPanel
//             transcription={transcription}
//             loading={loading}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App



import { useState, useRef } from 'react'
import RecordingPanel from './components/RecordingPanel'
import TranscriptionPanel from './components/TranscriptionPanel'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      setError('')
      setTranscription('')

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)

    } catch (err) {
      const msg =
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access.'
          : `Microphone error: ${err.message}`

      setError(msg)
      console.error(err)
    }
  }

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return

    try {
      setLoading(true)
      setError('')

      const mediaRecorder = mediaRecorderRef.current
      mediaRecorder.stop()
      setIsRecording(false)

      await new Promise(resolve => {
        mediaRecorder.onstop = resolve
      })

      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm'
      })

      const text = await transcribeWithDeepgram(audioBlob)
      setTranscription(text)

    } catch (err) {
      setError(`Transcription error: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const transcribeWithDeepgram = async (audioBlob) => {
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY

    if (!apiKey) {
      throw new Error('Deepgram API key not found')
    }

    const response = await fetch(
      'https://api.deepgram.com/v1/listen?model=nova-2&language=en',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'audio/webm'
        },
        body: audioBlob
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText)
    }

    const result = await response.json()

    return result.results.channels[0].alternatives[0].transcript
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Wispr</h1>
            <p className="text-gray-600">
              Convert your speech to text instantly
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Controls */}
          <RecordingPanel
            isRecording={isRecording}
            loading={loading}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />

          {/* Transcription */}
          <TranscriptionPanel
            transcription={transcription}
            loading={loading}
          />

        </div>
      </div>
    </div>
  )
}

export default App

