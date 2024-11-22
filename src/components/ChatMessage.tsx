import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${isBot ? 'bg-gray-50' : ''} p-4 rounded-lg`}>
      {isBot ? (
        <Bot className="w-6 h-6 text-blue-600 flex-shrink-0" />
      ) : (
        <User className="w-6 h-6 text-gray-600 flex-shrink-0" />
      )}
      <p className="text-gray-700 leading-relaxed">{message}</p>
    </div>
  );
}