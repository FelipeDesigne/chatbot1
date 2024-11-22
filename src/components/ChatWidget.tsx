import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { chat } from '../lib/gemini';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Message {
  text: string;
  isBot: boolean;
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Olá! Como posso ajudar você hoje?', isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      const params = new URLSearchParams(window.location.search);
      const empresaId = params.get('empresaId');
      
      if (empresaId) {
        const docRef = doc(db, 'companies', empresaId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyInfo(`
            Nome da Empresa: ${data.name}
            Horário de Funcionamento: ${data.businessHours}
            Serviços: ${data.services}
            Política de Atendimento: ${data.supportPolicy}
            Contato: ${data.contact}
          `);
        }
      }
    };

    loadCompanyInfo();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await chat(userMessage, companyInfo);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'Desculpe, ocorreu um erro. Por favor, tente novamente mais tarde.', 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4">
        <h1 className="text-white text-lg font-semibold">Atendimento Online</h1>
      </div>

      {/* Chat Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} isBot={message.isBot} />
        ))}
        {isLoading && (
          <div className="flex gap-2 items-center text-gray-500">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce delay-100">●</div>
            <div className="animate-bounce delay-200">●</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}