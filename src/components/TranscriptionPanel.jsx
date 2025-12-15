export default function TranscriptionPanel({ transcription, loading }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(transcription)
  }

  const handleClear = () => {
    // This would require passing a callback from parent, for now just show a message
    alert('Refresh the app to clear the transcription')
  }

  return (
    <div className="border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Transcription</h2>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4">Processing your audio...</p>
          </div>
        </div>
      )}

      {!loading && transcription && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6 min-h-[120px] max-h-[300px] overflow-y-auto">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {transcription}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      {!loading && !transcription && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Your transcribed text will appear here
          </p>
        </div>
      )}
    </div>
  )
}
