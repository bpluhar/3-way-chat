import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-center mb-4 text-3xl font-bold">Hello World</h1>
      <Link href="/login">
        <button className="bg-blue-300 rounded-md px-4 py-2">
          Login
        </button>
      </Link>
    </div>
  );
}
