'use client';

import { Message } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

interface GeminiChatProps {
  messages: Message[];
}

export default function GeminiChat({ messages }: GeminiChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formattedMessages, setFormattedMessages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const formatMessages = async () => {
      const formatted: { [key: string]: string } = {};
      for (const message of messages) {
        formatted[message.id] = await formatMessage(message.content);
      }
      setFormattedMessages(formatted);
    };
    formatMessages();
  }, [messages]);

  const formatMessage = async (content: string) => {
    const processedContent = await remark()
      .use(html)
      .use(remarkGfm)
      .process(content);
    return processedContent.toString();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-grow overflow-auto p-4">
      {messages.map(m => {
        const content = m.role === 'assistant' ? m.content.replace(/\n\nTokens: \d+ input, \d+ output$/, '') : m.content;
        
        return (
          <div key={m.id} className={`mb-4 p-3 rounded-lg bg-[#101516] ${m.role === 'user' ? 'border border-zinc-700' : 'border border-yellow-500'}`}>
            <div className="flex items-center mb-2">
              <strong className="text-yellow-500">{m.role === 'user' ? 'User: ' : 'Assistant: '}</strong>
              {m.role === 'user' && (
                <span className="ml-2 text-sm text-zinc-400">
                  {formatTimestamp(m.id)}
                </span>
              )}
            </div>
            <div 
              className="prose prose-invert max-w-none text-zinc-300"
              dangerouslySetInnerHTML={{ __html: formattedMessages[m.id] || content }}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
