import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mt-8 mb-6">Dashboard</h1>
      <Link href="/dashboard/chat">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
          Chat
        </button>
      </Link>
    </div>
  );
}
