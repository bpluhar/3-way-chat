"use client"

import { logout } from '../auth/action';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#101516] text-zinc-100">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500 relative">
        <span className="relative z-10">Dashboard</span>
        <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
      </h1>
      <a href="/dashboard/chat">
        <button className="bg-yellow-500 w-[100px] hover:bg-yellow-600 text-zinc-900 font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#101516]">
          Chat
        </button>
      </a>
      <button
          onClick={() => logout()}
          className="bg-[#101516] m-4 w-[100px] hover:bg-[#1c2526] text-red-800 font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#060F11] border border-red-800"
        >
          Logout
        </button>
    </div>
  );
}
