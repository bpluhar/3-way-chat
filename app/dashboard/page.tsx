//"use client";

import LogoutButton from "@/components/LogoutButton";

import { Button } from "@/components/ui/button";
import DashboardMenuBar from "@/components/DashboardMenuBar";
import DashboardDropdownMenu from "@/components/DashboardDropdownMenu";

import Link from "next/link";
import { getUser } from "@/app/lib/actions";
import OpenAICard from "@/components/OpenAICard";
import AnthropicCard from "@/components/AnthropicCard";
import GoogleCard from "@/components/GoogleCard";

export default async function Dashboard() {
  const user = await getUser();

  const avatarUrl =
    `https://pocket.leaselogic.app/api/files/${user?.collectionId}/${user?.id}/${user?.avatar}`;

  return (
    <div className="flex flex-col w-full h-dvh bg-white text-black p-4">
      {
        /* {avatarUrl.length > `https://pocket.leaselogic.app/api/files/_pb_users_auth_/${user?.id}/`.length ? (
        <Image src={avatarUrl} alt="User Avatar" width={50} height={50} className="rounded-lg m-2" />
      ) : null} */
      }

      {/* Dashboard Menu Bar */}
      <div className="flex w-full justify-between mb-4">
        
        <DashboardMenuBar />
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* <div className="flex-1 overflow-hidden flex flex-col rounded-lg"> */}
        {/* OpenAI Chat Mobile */}
        <div className="flex flex-row w-full justify-between gap-2">  
          <OpenAICard />
          <AnthropicCard />
          <GoogleCard />
        </div>
        {/* <div className="flex items-center justify-between p-4 mt-4 border rounded-md border-gray-300">
          <h2 className="text-xl font-bold text-blue-600 rounded-md relative">
            <span className="relative z-10">OpenAI ChatGPT</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          {/* </h2> */}

          {
            /* <Link
            href="/dashboard/chat/openai"
            className="px-6 py-2 rounded-lg bg-yellow-500 text-zinc-900"
          >
            Chat
          </Link> */
          }
          {/* <Link href="/dashboard/chat/openai">
            <Button variant="default">Chat</Button>
          </Link>
        </div> */} 

        {/* Anthropic Claude Chat Mobile */}
        <div className="flex items-center justify-between p-4 border rounded-md border-gray-300">
          <h2 className="text-xl font-bold text-blue-600 rounded-md relative">
            <span className="relative z-10">Anthropic Claude</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="anthropic" /> */}
          </h2>

          <Link href="/dashboard/chat/anthropic">
            <Button variant="default">Chat</Button>
          </Link>
        </div>

        {/* Google Gemini Chat Mobile */}
        <div className="flex items-center justify-between p-4 border rounded-md border-gray-300">
          <h2 className="text-xl font-bold text-blue-600 rounded-md relative">
            <span className="relative z-10">Google Gemini</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          <Link href="/dashboard/chat/google">
            <Button variant="default">Chat</Button>
          </Link>
        </div>

        {/* 3-Way Chat */}
        <div className="flex items-center justify-between p-4 border rounded-md border-gray-300">
          <h2 className="text-xl font-bold text-blue-600 rounded-md relative">
            <span className="relative z-10">3-Way Chat</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          <Link href="/dashboard/chat">
            <Button variant="default">Chat</Button>
          </Link>
        </div>
      {/* </div> */}
    </div>
  );
}
