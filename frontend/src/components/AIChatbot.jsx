import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../services/api';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Welcome to M Timepiece. I am your personal concierge. How may I assist you with our collection today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Exclude the initial welcome message so history starts with 'user'
      const history = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const data = await sendChatMessage(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: data.response }]);
    } catch (error) {
      console.error(error);
      const errorMsg = error.message || "I apologize, but I am unable to connect to the server at this moment.";
      setMessages(prev => [...prev, { role: 'model', text: `${errorMsg} Please try again momentarily.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-6 z-[60]"> 
      {/* Positioned higher to avoid Tawk.to overlap */}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden font-sans"
          >
            {/* Premium Header */}
            <div className="p-4 bg-black text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
              <div className="relative flex items-center gap-3 z-10">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
                   <Sparkles size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg tracking-wide text-amber-50">M Timepiece</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Concierge Active</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#FAFAFA]"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex justify-center mb-4">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Today</span>
              </div>
              
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role !== 'user' && (
                       <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                         <Bot size={14} className="text-amber-400" />
                       </div>
                    )}
                    
                    <div className={`p-3.5 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-black text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                         <Bot size={14} className="text-gray-400" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your inquiry..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-all outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                 <p className="text-[10px] text-gray-400">Powered by M Timepiece AI</p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button - Floating & Pulsing */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-black text-amber-400 rounded-full shadow-2xl shadow-black/20 flex items-center justify-center group overflow-hidden border border-amber-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-gray-800"></div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine transition-all"></div>
        
        <div className="relative z-10">
            {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        </div>
        
        {/* Notification Dot */}
        {!isOpen && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            </span>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatbot;
