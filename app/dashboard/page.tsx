"use client";

import { logout } from "../auth/action";
import Link from "next/link";
export default function Dashboard() {
  return (
    <div className="flex flex-col w-full h-dvh bg-[#101516] text-zinc-100 p-4">
      <div className="w-full mb-4 p-4 bg-[#060F11] rounded-lg border border-zinc-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
          <span className="relative z-10">Dashboard</span>
          <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
        </h2>

        <button
          onClick={() => logout()}
          className="bg-[#101516] hover:bg-[#1c2526] text-red-800 font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#060F11] border border-red-800"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col rounded-lg border border-zinc-700 bg-[#060F11] gap-4">
        {/* OpenAI Chat Mobile */}
        <div className="flex items-center justify-between p-4 mx-4 mt-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">OpenAI ChatGPT</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          <Link
            href="/dashboard/chat/openai"
            className="px-6 py-2 rounded-lg bg-yellow-500 text-zinc-900"
          >
            Chat
          </Link>
        </div>

        {/* Anthropic Claude Chat Mobile */}
        <div className="flex items-center justify-between p-4 mx-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">Anthropic Claude</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="anthropic" /> */}
          </h2>

          <Link
            href="/dashboard/chat/anthropic"
            className="px-6 py-2 rounded-lg bg-yellow-500 text-zinc-900"
          >
            Chat
          </Link>
        </div>

        {/* Google Gemini Chat Mobile */}
        <div className="flex items-center justify-between p-4 mx-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">Google Gemini</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          <Link
            href="/dashboard/chat/google"
            className="px-6 py-2 rounded-lg bg-yellow-500 text-zinc-900"
          >
            Chat
          </Link>
        </div>

        {/* 3-Way Chat */}
        <div className="flex items-center justify-between p-4 mx-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">3-Way Chat</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          <Link
            href="/dashboard/chat"
            className="px-6 py-2 rounded-lg bg-yellow-500 text-zinc-900"
          >
            Chat
          </Link>
        </div>


      </div>
    </div>
  );
}
