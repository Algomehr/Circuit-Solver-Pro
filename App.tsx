
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, MessagePart } from './types';
import { sendMessageStream } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import { Send, Image as ImageIcon, Loader2, Sparkles, Trash2, Camera } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      parts: [{ text: '# خوش آمدید به دستیار هوشمند مدارات الکتریکی! ⚡\nمن آماده‌ام تا به شما در حل پیچیده‌ترین مسائل مدارهای الکتریکی (DC، AC، گذرا و فازور) کمک کنم.\n\nشما می‌توانید:\n- **متن مسئله** را بنویسید.\n- **تصویر مدار** را آپلود کنید.\n\nمنتظر اولین سوال شما هستم.' }],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userParts: MessagePart[] = [];
    if (selectedImage) {
      userParts.push({ inlineData: selectedImage });
    }
    if (input.trim()) {
      userParts.push({ text: input });
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      parts: userParts,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const modelId = (Date.now() + 1).toString();
      let accumulatedText = '';
      
      const stream = sendMessageStream(newMessages);
      
      setMessages(prev => [...prev, {
        id: modelId,
        role: Role.MODEL,
        parts: [{ text: '' }],
        timestamp: new Date()
      }]);

      for await (const chunk of stream) {
        accumulatedText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelId 
            ? { ...msg, parts: [{ text: accumulatedText }] }
            : msg
        ));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: Role.MODEL,
        parts: [{ text: '❌ متاسفانه خطایی در ارتباط با سرور رخ داد. لطفا دوباره تلاش کنید.' }],
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تمام گفتگو را پاک کنید؟')) {
      setMessages([{
        id: 'welcome',
        role: Role.MODEL,
        parts: [{ text: '# خوش آمدید به دستیار هوشمند مدارات الکتریکی! ⚡\nمن آماده‌ام تا به شما در حل پیچیده‌ترین مسائل مدارهای الکتریکی کمک کنم.' }],
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto border-x border-slate-800 bg-slate-950 shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Sparkles className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Circuit Solver Pro</h1>
            <p className="text-xs text-slate-400">هوش مصنوعی متخصص مهندسی برق</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="پاک کردن گفتگو"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 sticky bottom-0">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <img 
              src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
              alt="Preview" 
              className="h-24 w-auto rounded-lg border-2 border-blue-500"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-3 bg-slate-800 rounded-2xl p-2 border border-slate-700 shadow-inner">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-blue-400 transition-colors"
            title="آپلود تصویر مدار"
          >
            <ImageIcon size={24} />
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="صورت مسئله را اینجا بنویسید..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none max-h-40 py-3 px-2 text-right"
            dir="rtl"
            rows={1}
          />
          
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className={`p-3 rounded-xl transition-all ${
              isLoading || (!input.trim() && !selectedImage)
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
            }`}
          >
            <Send size={24} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-2">
          فرمول‌ها با فرمت لاتکس رندر می‌شوند. می‌توانید از $ برای فرمول‌های خطی استفاده کنید.
        </p>
      </footer>
    </div>
  );
};

export default App;
