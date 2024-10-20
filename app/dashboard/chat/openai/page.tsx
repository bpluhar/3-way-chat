"use client";

import { useState } from "react";
import OpenAIChat from "@/components/OpenAIChat";
import SharedInputForm from "@/components/SharedInputForm";
//import TokenCounter from '@/components/TokenCounter';
import { Message } from "ai";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

export default function Home() {
  const [syncedInput, setSyncedInput] = useState("");
  const [syncStates] = useState({
    openai: false,
    claude: false,
    gemini: false,
  });
  const [openAIMessages, setOpenAIMessages] = useState<Message[]>([]);
  // const [claudeMessages, setClaudeMessages] = useState<Message[]>([]);
  // const [geminiMessages, setGeminiMessages] = useState<Message[]>([]);

  const handleSyncedInputChange = (value: string) => {
    setSyncedInput(value);
  };

  //   const toggleSync = (model: 'openai' | 'claude' | 'gemini') => {
  //     setSyncStates(prev => ({ ...prev, [model]: !prev[model] }));
  //   };

  const handleSubmit = (apiEndpoint: string) => async (input: string) => {
    if (input.trim() === "") return;

    const timestamp = Date.now();
    const userMessage: Message = {
      role: "user",
      content: input,
      id: timestamp.toString(),
    };
    setSyncedInput("");

    const endpoints = {
      openai: "/api/chat/openai",
    };

    let endpointsToUse: string[];

    // Check if the submitted chat's sync is disabled
    const submittedModel = Object.keys(endpoints).find(
      (key) => endpoints[key as keyof typeof endpoints] === apiEndpoint,
    );
    if (
      submittedModel &&
      !syncStates[submittedModel as keyof typeof syncStates]
    ) {
      // If sync is disabled for the submitted chat, only use its endpoint
      endpointsToUse = [apiEndpoint];
    } else {
      // Otherwise, use all synced endpoints
      endpointsToUse = Object.entries(syncStates)
        .filter((entry) => entry[1])
        .map(([model]) => endpoints[model as keyof typeof endpoints]);

      // If no toggles are on, only use the endpoint of the form that was submitted
      if (endpointsToUse.length === 0) {
        endpointsToUse = [apiEndpoint];
      }
    }

    const apiCalls = endpointsToUse.map(async (endpoint) => {
      let setMessages;
      if (endpoint.includes("openai")) {
        setOpenAIMessages((prev) => [...prev, userMessage]);
        setMessages = setOpenAIMessages;
      }

      if (!setMessages) return;

      const aiMessageId = uuidv4();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", id: aiMessageId },
      ]);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: input }],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let fullContent = "";
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }
            const chunk = decoder.decode(value);
            fullContent += chunk;

            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (
                lastMessage.role === "assistant" &&
                lastMessage.id === aiMessageId
              ) {
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
    <div className="flex flex-col w-full h-dvh bg-[#101516] text-zinc-100 p-4">
      <div className="w-full mb-4 p-4 bg-[#060F11] rounded-lg border border-zinc-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-yellow-500">Chat</h1>
        <Link
          href="/dashboard"
          className="bg-[#101516] hover:bg-[#1c2526] text-yellow-500 font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#060F11] border border-yellow-500"
        >
          Menu
        </Link>
      </div>
      <div className="flex flex-row flex-grow overflow-hidden space-x-4">
        <div className="flex-1 overflow-hidden flex flex-col rounded-lg border border-zinc-700 bg-[#060F11]">
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
              <span className="relative z-10">OpenAI (gpt-4o-mini)</span>
              <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md">
              </span>
              {/* <TokenCounter provider="openai" /> */}
            </h2>
          </div>
          <div className="flex-grow overflow-hidden flex flex-col">
            <OpenAIChat messages={openAIMessages} />
            <div className="p-4 border-t border-zinc-700">
              <SharedInputForm
                onSubmit={handleSubmit("/api/chat/openai")}
                synced={syncStates.openai}
                syncedInput={syncedInput}
                onSyncedInputChange={handleSyncedInputChange}
                apiEndpoint="OpenAI"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
