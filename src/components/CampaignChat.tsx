import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/campaign';
import { addChatMessage } from '@/firebase/campaignUtils';
import { Timestamp } from 'firebase/firestore';

interface CampaignChatProps {
  campaignId: string;
  messages: ChatMessage[];
  userId: string;
  userName: string;
  onNewMessage?: (message: ChatMessage) => void;
}

export default function CampaignChat({ campaignId, messages, userId, userName, onNewMessage }: CampaignChatProps) {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: Date | Timestamp) => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    try {
      setSending(true);
      const newMessage = await addChatMessage(campaignId, userId, userName, messageText.trim());
      setMessageText('');
      if (onNewMessage) {
        onNewMessage(newMessage);
      }
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
      alert('Non è stato possibile inviare il messaggio. Riprova più tardi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-gray-700 border-b border-gray-600">
        <h2 className="text-xl font-semibold text-yellow-500">Chat di Campagna</h2>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 max-h-[400px]">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 my-6">
            Nessun messaggio. Inizia la conversazione!
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex flex-col ${message.userId === userId ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.userId === userId 
                      ? 'bg-yellow-700 text-white' 
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <div className="text-xs text-gray-300 mb-1">
                    {message.userId === userId ? 'Tu' : message.userName} - {formatTime(message.timestamp)}
                  </div>
                  <p className="break-words">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 bg-gray-700 border-t border-gray-600 flex">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none"
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-r-md"
          disabled={sending || !messageText.trim()}
        >
          {sending ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Invia'
          )}
        </button>
      </form>
    </div>
  );
} 