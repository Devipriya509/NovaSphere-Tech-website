import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hi there! 👋 I am Nova, your AI assistant. How can I help you today? You can ask me about our services, pricing, business hours, or request a project cost calculation.',
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg = { sender: 'user', text: userText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Map conversation history context
      const formattedHistory = messages.map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        text: msg.text
      }));

      const res = await api.post('/chatbot/message', {
        message: userText,
        history: formattedHistory
      });

      if (res.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: res.reply, time: new Date() }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: 'I apologize, but I encountered an error retrieving that answer. Please try again.', 
          time: new Date() 
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Connection failed. Please ensure the backend server is running and GEMINI_API_KEY is configured in server/.env.', 
        time: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="ai-chat-bubble">
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window glass-card" style={{
          padding: 0,
          border: '1px solid var(--primary)',
          boxShadow: '0 12px 40px rgba(6, 182, 212, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '0.35rem',
                borderRadius: '50%',
                display: 'flex'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>NovaSphere AI</h4>
                <p style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={8} /> Online & Ready
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(3, 7, 18, 0.2)',
            maxHeight: '300px',
            minHeight: '250px'
          }}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: m.sender === 'ai' ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  display: 'flex',
                  gap: '0.5rem',
                  flexDirection: m.sender === 'ai' ? 'row' : 'row-reverse'
                }}
              >
                {/* Avatar icon */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: m.sender === 'ai' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  border: `1px solid ${m.sender === 'ai' ? 'var(--primary)' : 'var(--secondary)'}`,
                  color: m.sender === 'ai' ? 'var(--primary)' : 'var(--secondary)',
                  flexShrink: 0
                }}>
                  {m.sender === 'ai' ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* Bubble content */}
                <div style={{
                  background: m.sender === 'ai' ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                  border: `1px solid ${m.sender === 'ai' ? 'var(--card-border)' : 'rgba(99, 102, 241, 0.3)'}`,
                  padding: '0.75rem 1rem',
                  borderRadius: m.sender === 'ai' ? '0 16px 16px 16px' : '16px 0 16px 16px',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line'
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  <Bot size={14} />
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--card-border)',
                  padding: '0.65rem 1rem',
                  borderRadius: '0 16px 16px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>Nova is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--card-border)',
            background: 'var(--card-bg)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input 
              type="text" 
              placeholder="Ask me a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '9999px',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-color)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isTyping || !input.trim()}
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={14} style={{ color: 'var(--text-inverse)' }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
