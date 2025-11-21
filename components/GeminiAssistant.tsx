import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { MOCK_COURSES, MOCK_ASSIGNMENTS, MOCK_ANNOUNCEMENTS } from '../services/mockDb';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const GeminiAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.name}! I'm Dadu, your AI academic assistant. How can I help you today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare Context
    const contextData = {
      userProfile: user,
      courses: MOCK_COURSES,
      assignments: MOCK_ASSIGNMENTS,
      announcements: MOCK_ANNOUNCEMENTS
    };
    
    const contextString = JSON.stringify(contextData, null, 2);

    const aiResponseText = await generateAIResponse(userMessage.content, contextString);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-sm">
          <Bot size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 dark:text-white">Dadu Assistant</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online • Powered by Gemini
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
              ${msg.role === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'}
            `}>
              {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-tl-none'
              }
            `}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
              <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 flex items-center justify-center">
               <Bot size={16} />
             </div>
             <div className="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-slate-400" />
               <span className="text-sm text-slate-500 dark:text-slate-300">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your schedule, assignments, or grades..."
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;