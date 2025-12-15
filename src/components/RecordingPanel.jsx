import { useEffect, useState } from 'react'

export default function RecordingPanel({ isRecording, loading, onStartRecording, onStopRecording }) {
  const [recordingTime, setRecordingTime] = useState(0)

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="mb-8">
      {/* Recording Indicator */}
      {isRecording && (
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Recording: {formatTime(recordingTime)}</span>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onStartRecording}
          disabled={isRecording || loading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isRecording || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>

        <button
          onClick={onStopRecording}
          disabled={!isRecording || loading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            !isRecording || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
          }`}
        >
          {loading ? 'Processing...' : 'Stop Recording'}
        </button>
      </div>
    </div>
  )
}
