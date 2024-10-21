//"use client";

import LogoutButton from "@/components/LogoutButton";

import { Button } from "@/components/ui/button";
import DashboardMenuBar from "@/components/DashboardMenuBar";

import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/app/lib/actions";

export default async function Dashboard() {

  const user = await getUser();

  const avatarUrl = `https://pocket.leaselogic.app/api/files/${user?.collectionId}/${user?.id}/${user?.avatar}`;

  return (
    
    <div className="flex flex-col w-full h-dvh bg-[#101516] text-zinc-100 p-4">
      {avatarUrl.length > `https://pocket.leaselogic.app/api/files/_pb_users_auth_/${user?.id}/`.length ? (
        <Image src={avatarUrl} alt="User Avatar" width={50} height={50} className="rounded-lg m-2" />
      ) : null}
      <div className="w-full mb-4 p-4 bg-[#060F11] rounded-lg border border-zinc-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
          <span className="relative z-10">Dashboard</span>
          <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
        </h2>

        <DashboardMenuBar />

        {/* <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="text-black">Settings</MenubarTrigger>
            <MenubarContent>            
              <MenubarItem className="text-red-500" onClick={() => logout()}>Logout</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>   */}

        <LogoutButton />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col rounded-lg border border-zinc-700 bg-[#060F11] gap-4">
        {/* OpenAI Chat Mobile */}
        <div className="flex items-center justify-between p-4 mx-4 mt-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">OpenAI ChatGPT</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          {/* <Link
            href="/dashboard/chat/openai"
            className="px-6 py-2 rounded-lg bg-yellow-500 text-zinc-900"
          >
            Chat
          </Link> */}
          <Link href="/dashboard/chat/openai">
            <Button variant="default">Chat</Button>
          </Link>
        </div>

        {/* Anthropic Claude Chat Mobile */}
        <div className="flex items-center justify-between p-4 mx-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">Anthropic Claude</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="anthropic" /> */}
          </h2>

          <Link href="/dashboard/chat/anthropic">
            <Button variant="default">Chat</Button>
          </Link>
        </div>

        {/* Google Gemini Chat Mobile */}
        <div className="flex items-center justify-between p-4 mx-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">Google Gemini</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          <Link href="/dashboard/chat/google">
            <Button variant="default">Chat</Button>
          </Link>
        </div>

        {/* 3-Way Chat */}
        <div className="flex items-center justify-between p-4 mx-4 border rounded-md border-zinc-700">
          <h2 className="text-xl font-bold text-yellow-500 rounded-md relative">
            <span className="relative z-10">3-Way Chat</span>
            {/* <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-lg rounded-md"></span> */}
            {/* <TokenCounter provider="openai" /> */}
          </h2>

          <Link href="/dashboard/chat">
            <Button variant="default">Chat</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
