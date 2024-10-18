import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#101516] text-zinc-100">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500 relative">
        <span className="relative z-10">Dashboard</span>
        <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
      </h1>
      <Link href="/dashboard/chat">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#101516]">
          Chat
        </button>
      </Link>
    </div>
  );
}
