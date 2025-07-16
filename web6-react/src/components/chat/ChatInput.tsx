import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useSpeech } from '../../hooks/useSpeech';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
    browserSupport,
  } = useSpeech({ continuous: true, interimResults: true, lang: 'ko-KR' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.nativeEvent.isComposing === false) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit(e);
      }
    }
  };

  useEffect(() => {
    setMessage(transcript);
  }, [transcript]);

  return (
    <>
      {!browserSupport.isSupported && <p style={{ color: 'red' }}>{browserSupport.errorMessage}</p>}
      <div className='flex gap-2'>
        <div className='flex relative flex-1'>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type a message...'
            className='flex-1 min-h-[44px] max-h-[160px] p-3 bg-zinc-700/50 text-gray-100 placeholder:text-gray-400 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-white/20'
          />
          <button
            onClick={toggleListening}
            disabled={!browserSupport.isSupported}
            className='absolute left-[650px] p-3 bg-zinc-700/50 text-gray-100 placeholder:text-gray-400 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-white/20'
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <button
            type='submit'
            disabled={!message.trim() || disabled}
            className='px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
