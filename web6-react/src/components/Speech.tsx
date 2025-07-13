import { useSpeech } from '../hooks/useSpeech';

const Speech: React.FC = () => {
  const {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
    browserSupport,
  } = useSpeech({ continuous: true, interimResults: true, lang: 'ko-KR' });

  return (
    <div>
      <h1>Speech to Text</h1>

      {!browserSupport.isSupported && <p style={{ color: 'red' }}>{browserSupport.errorMessage}</p>}

      {browserSupport.isSupported && (
        <>
          <button onClick={toggleListening} disabled={!browserSupport.isSupported}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <button onClick={startListening} disabled={isListening || !browserSupport.isSupported}>
            Force Start
          </button>
          <button onClick={stopListening} disabled={!isListening || !browserSupport.isSupported}>
            Force Stop
          </button>

          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          <p>Status: {isListening ? 'Listening...' : 'Idle'}</p>

          <div>
            <h2>Transcript:</h2>
            <div
              style={{
                border: '1px solid #ccc',
                minHeight: '100px',
                padding: '10px',
                marginTop: '10px',
                whiteSpace: 'pre-wrap', // Preserve line breaks
              }}
            >
              {transcript || 'Speak into your microphone...'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Speech;
