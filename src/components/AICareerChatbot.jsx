import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Trash2, Sparkles, MessageSquare, 
  HelpCircle, Loader2, ArrowRight, ShieldCheck, Copy, Check
} from 'lucide-react';
import { toast } from './ToastProvider';

const presetQuestions = [
  "What technical interview questions will I face?",
  "How can I optimize my experience bullet points?",
  "Which high-demand skills am I currently missing?",
  "How to highlight leadership in a software engineering resume?"
];

const AICareerChatbot = ({ resumeId, api }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I am your personal AI Placement Officer & Career Strategist. I've analyzed your uploaded resume metrics. Ask me anything about interview prep, technical skill gaps, salary negotiation, or bullet point optimization!" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSend = async (text) => {
    const messageText = text || inputValue;
    if (!messageText || messageText.trim() === '') return;

    setInputValue('');

    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    try {
      const historyPayload = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await api.post(`/api/resumes/${resumeId}/chat`, {
        message: messageText,
        history: historyPayload
      });

      const assistantMsg = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat failure", err);
      const errMsg = { 
        role: 'assistant', 
        content: "I encountered a minor network issue querying the advisor model. Please check your API setup and try again." 
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (index, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearHistory = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: "Chat history refreshed! How can I assist with your career goals today?" 
      }
    ]);
  };

  return (
    <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[540px] shadow-2xl animate-fade-in relative">
      
      {/* Chat Header */}
      <div className="p-4 px-6 border-b border-white/10 flex justify-between items-center bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20 neon-border-indigo">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <span>Placement AI Copilot</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-indigo-400" />
              <span>Resume Metric Context Loaded</span>
            </div>
          </div>
        </div>

        <button
          onClick={clearHistory}
          className="p-2 rounded-xl border border-white/10 bg-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition cursor-pointer"
          title="Clear Chat History"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-slate-950/20">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div 
              key={index}
              className={`flex gap-3 max-w-[85%] ${isAssistant ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${
                isAssistant 
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              }`}>
                {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Message Pill */}
              <div className={`relative group p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-md ${
                isAssistant 
                  ? 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
              }`}>
                {msg.content}

                {/* Copy action */}
                {isAssistant && (
                  <button
                    onClick={() => copyMessage(index, msg.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white"
                  >
                    {copiedIndex === index ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex items-center gap-3 text-xs text-purple-400 animate-pulse">
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing resume vectors...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestion Chips */}
      {messages.length < 3 && (
        <div className="px-6 py-2 bg-slate-950/40 border-t border-white/5 flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30 text-slate-300 hover:text-purple-300 transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 border-t border-white/10 bg-slate-950/80 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI Copilot anything about your career..."
            className="flex-1 rounded-xl px-4 py-2.5 text-xs glass-input placeholder:text-slate-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={sending || !inputValue.trim()}
            className="glass-button-primary p-2.5 rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default AICareerChatbot;
