'use client';

import { useState } from 'react';
import OpenAIChat from '@/components/OpenAIChat';
import ClaudeChat from '@/components/ClaudeChat';
import GeminiChat from '@/components/GeminiChat';
import SharedInputForm from '@/components/SharedInputForm';
import TokenCounter from '@/components/TokenCounter';
import { Message } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { logout } from '@/app/auth/action';

export default function Home() {

  const [syncedInput, setSyncedInput] = useState('');
  const [syncStates, setSyncStates] = useState({
    openai: true,
    claude: true,
    gemini: true
  });
  const [openAIMessages, setOpenAIMessages] = useState<Message[]>([]);
  const [claudeMessages, setClaudeMessages] = useState<Message[]>([]);
  const [geminiMessages, setGeminiMessages] = useState<Message[]>([]);

  const handleSyncedInputChange = (value: string) => {
    setSyncedInput(value);
  };

  const toggleSync = (model: 'openai' | 'claude' | 'gemini') => {
    setSyncStates(prev => ({ ...prev, [model]: !prev[model] }));
  };

  const handleSubmit = (apiEndpoint: string) => async (input: string) => {
    if (input.trim() === '') return;

    const timestamp = Date.now();
    const userMessage: Message = { role: 'user', content: input, id: timestamp.toString() };
    setSyncedInput("");

    const endpoints = {
      openai: '/api/chat/openai',
      claude: '/api/chat/claude',
      gemini: '/api/chat/gemini'
    };

    let endpointsToUse: string[];

    // Check if the submitted chat's sync is disabled
    const submittedModel = Object.keys(endpoints).find(key => endpoints[key as keyof typeof endpoints] === apiEndpoint);
    if (submittedModel && !syncStates[submittedModel as keyof typeof syncStates]) {
      // If sync is disabled for the submitted chat, only use its endpoint
      endpointsToUse = [apiEndpoint];
    } else {
      // Otherwise, use all synced endpoints
      endpointsToUse = Object.entries(syncStates)
        .filter(entry => entry[1])
        .map(([model]) => endpoints[model as keyof typeof endpoints]);
      
      // If no toggles are on, only use the endpoint of the form that was submitted
      if (endpointsToUse.length === 0) {
        endpointsToUse = [apiEndpoint];
      }
    }

    const apiCalls = endpointsToUse.map(async (endpoint) => {
      let setMessages;
      if (endpoint.includes('openai')) {
        setOpenAIMessages(prev => [...prev, userMessage]);
        setMessages = setOpenAIMessages;
      } else if (endpoint.includes('claude')) {
        setClaudeMessages(prev => [...prev, userMessage]);
        setMessages = setClaudeMessages;
      } else if (endpoint.includes('gemini')) {
        setGeminiMessages(prev => [...prev, userMessage]);
        setMessages = setGeminiMessages;
      }

      if (!setMessages) return;

      const aiMessageId = uuidv4();
      setMessages(prev => [...prev, { role: 'assistant', content: '', id: aiMessageId }]);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: input }],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (reader) {
          let fullContent = '';
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              
              break;
            }
            const chunk = decoder.decode(value);
            fullContent += chunk;
            
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage.role === 'assistant' && lastMessage.id === aiMessageId) {
                lastMessage.content = fullContent;
              }
              return newMessages;
            });
          }
        }
      } catch (error) {
        console.error(`Error sending message to ${endpoint}:`, error);
      }
    });

    await Promise.all(apiCalls);
  };  

  return (
    <div className="flex flex-col w-full h-screen bg-[#101516] text-zinc-100 p-4">
      <div className="w-full mb-4 p-4 bg-[#060F11] rounded-lg border border-zinc-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-yellow-500">Chat</h1>
        <button
          onClick={() => logout()}
          className="bg-[#101516] hover:bg-[#1c2526] text-red-800 font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#060F11] border border-red-800"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-row flex-grow overflow-hidden space-x-4">
        
        <div className="flex-1 overflow-hidden flex flex-col rounded-lg border border-zinc-700 bg-[#060F11]">
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
              <span className="relative z-10">OpenAI</span>
              <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
              {/* <TokenCounter provider="openai" /> */}
            </h2>
            
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-yellow-500">Sync</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={syncStates.openai}
                  onChange={() => toggleSync('openai')}
                />
                <div className={`block w-10 h-4 rounded-full transition-colors ${syncStates.openai ? 'bg-yellow-500' : 'bg-[#2f3030]'}`}></div>
                <div className={`absolute -left-1 -top-1 bg-white w-6 h-6 rounded-full transition-transform ${syncStates.openai ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="flex-grow overflow-hidden flex flex-col">
            <OpenAIChat messages={openAIMessages} />
            <div className="p-4 border-t border-zinc-700">
              <SharedInputForm
                onSubmit={handleSubmit('/api/chat/openai')}
                synced={syncStates.openai}
                syncedInput={syncedInput}
                onSyncedInputChange={handleSyncedInputChange}
                apiEndpoint="OpenAI"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col rounded-lg border border-zinc-700 bg-[#060F11]">
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
              <span className="relative z-10">Anthropic</span>
              <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
              {/* <TokenCounter provider="anthropic" /> */}
            </h2>
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-yellow-500">Sync</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={syncStates.claude}
                  onChange={() => toggleSync('claude')}
                />
                <div className={`block w-10 h-4 rounded-full transition-colors ${syncStates.claude ? 'bg-yellow-500' : 'bg-[#2f3030]'}`}></div>
                <div className={`absolute -left-1 -top-1 bg-white w-6 h-6 rounded-full transition-transform ${syncStates.claude ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="flex-grow overflow-hidden flex flex-col">
            <ClaudeChat messages={claudeMessages} />
            <div className="p-4 border-t border-zinc-700">
              <SharedInputForm
                onSubmit={handleSubmit('/api/chat/claude')}
                synced={syncStates.claude}
                syncedInput={syncedInput}
                onSyncedInputChange={handleSyncedInputChange}
                apiEndpoint="Claude"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col rounded-lg border border-zinc-700 bg-[#060F11]">
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
              <span className="relative z-10">Google</span>
              <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
              {/* <TokenCounter provider="google" /> */}
            </h2>
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-yellow-500">Sync</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={syncStates.gemini}
                  onChange={() => toggleSync('gemini')}
                />
                <div className={`block w-10 h-4 rounded-full transition-colors ${syncStates.gemini ? 'bg-yellow-500' : 'bg-[#2f3030]'}`}></div>
                <div className={`absolute -left-1 -top-1 bg-white w-6 h-6 rounded-full transition-transform ${syncStates.gemini ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="flex-grow overflow-hidden flex flex-col">
            <GeminiChat messages={geminiMessages} />
            <div className="p-4 border-t border-zinc-700">
              <SharedInputForm
                onSubmit={handleSubmit('/api/chat/gemini')}
                synced={syncStates.gemini}
                syncedInput={syncedInput}
                onSyncedInputChange={handleSyncedInputChange}
                apiEndpoint="Gemini"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
