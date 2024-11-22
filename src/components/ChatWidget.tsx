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

interface ChatWidgetProps {
  empresaId: string;
}

export function ChatWidget({ empresaId }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Olá! Como posso ajudar você hoje?', isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      if (empresaId) {
        const docRef = doc(db, 'companies', empresaId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyInfo(`
            Nome da empresa: ${data.name}
            Descrição: ${data.description}
            Horário de funcionamento: ${data.businessHours}
            Telefone: ${data.phone}
            Produtos/Serviços: ${data.products}
          `);
        }
      }
    };

    loadCompanyInfo();
  }, [empresaId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await chat(userMessage, companyInfo);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error('Error chatting:', error);
      setMessages(prev => [...prev, { text: 'Desculpe, ocorreu um erro. Tente novamente mais tarde.', isBot: true }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} isBot={message.isBot} />
        ))}
        {isLoading && <ChatMessage message="Digitando..." isBot={true} />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}