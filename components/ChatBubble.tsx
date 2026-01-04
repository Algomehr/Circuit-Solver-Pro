
import React from 'react';
import { Message, Role } from '../types.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx';
import { User, Cpu } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 justify-start`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] flex-row`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 ml-3' : 'bg-emerald-600 ml-3'}`}>
          {isUser ? <User size={20} /> : <Cpu size={20} />}
        </div>
        <div className={`flex flex-col items-start`}>
          <div className={`px-5 py-4 rounded-2xl shadow-lg border ${
            isUser 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-slate-900 border-slate-800'
          }`}>
            {message.parts.map((part, idx) => (
              <div key={idx} className="space-y-4">
                {part.inlineData && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-slate-700">
                    <img 
                      src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} 
                      alt="Circuit problem" 
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
                {part.text && <MarkdownRenderer content={part.text} />}
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-500 mt-1 px-2">
            {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
