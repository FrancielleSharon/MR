
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';

// Omitindo a declaração global para evitar conflito com os tipos pré-definidos do sistema.
// O acesso será feito via (window as any).aistudio para garantir compatibilidade e funcionamento das chamadas.

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o consultor virtual da Imóveis MR. Como posso ajudar você a encontrar seu novo lar hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKeyError, setHasApiKeyError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Fix: Use casting to any to access aistudio properties without type conflicts
  const handleSelectKey = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setHasApiKeyError(false);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Chave configurada! Como posso te ajudar agora?' }]);
    } catch (err) {
      console.error("Erro ao abrir seletor de chave", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Check if API key is selected before making the call
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setHasApiKeyError(true);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Parece que você ainda não selecionou uma chave de API. Por favor, clique no botão abaixo para configurar o acesso ao Consultor Virtual.' 
        }]);
        setIsLoading(false);
        return;
      }

      const currentHistory = messages.slice(1);
      const formattedHistory = currentHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await getGeminiResponse(userMsg, formattedHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setHasApiKeyError(false);
    } catch (error: any) {
      console.error("Erro no Chat:", error);
      
      // Se for erro de chave, ativa a interface de recuperação
      if (error.message?.includes("API key") || error.status === 403 || error.status === 400 || error.message?.includes("Requested entity was not found")) {
        setHasApiKeyError(true);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Parece que há um problema com a configuração de acesso à IA. Por favor, clique no botão abaixo para configurar sua chave de API.' 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um pequeno problema técnico. Poderia tentar novamente?' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 bg-white rounded-[40px] shadow-2xl border border-slate-200 mb-4 overflow-hidden flex flex-col max-h-[550px] animate-in slide-in-from-bottom-5 duration-500">
          {/* Header */}
          <div className="bg-[#fcbf49] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl shadow-inner">🏢</div>
              <div className="text-left">
                <p className="font-black text-sm leading-none uppercase tracking-tight">Consultor MR</p>
                <p className="text-[9px] mt-1 font-bold opacity-80 uppercase tracking-widest">Maria de Lourdes Lima</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50 min-h-[350px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-[#fcbf49] text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {m.content}
                  {/* Botão especial de erro de chave */}
                  {hasApiKeyError && i === messages.length - 1 && m.role === 'assistant' && (
                    <button 
                      onClick={handleSelectKey}
                      className="mt-4 w-full bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#fcbf49] transition-all"
                    >
                      Configurar Chave API
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#fcbf49] rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#fcbf49] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-[#fcbf49] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: Apartamento no Itaim..." 
                className="flex-grow bg-slate-100 border-none rounded-2xl px-5 py-3 text-xs font-bold focus:ring-2 ring-[#fcbf49] outline-none transition-all"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-[#fcbf49] text-white p-3 rounded-2xl shadow-xl hover:bg-slate-900 transition-all disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Launcher */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#fcbf49] rounded-full shadow-2xl flex items-center justify-center text-white text-3xl hover:scale-110 transition-all active:scale-95 shadow-[#fcbf49]/40 border-4 border-white"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
};
