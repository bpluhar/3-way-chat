// ./app/page.tsx

import { login } from '../auth/action';

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#101516] text-zinc-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#060F11] rounded-xl shadow-lg border border-zinc-700">
        <h2 className="text-3xl font-bold text-center text-yellow-500 relative">
          <span className="relative z-10">Login</span>
          <span className="absolute inset-0 bg-yellow-500 opacity-20 blur-xl rounded-md"></span>
        </h2>
        <form action={login} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-[#101516] border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-[#101516] border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-zinc-900 bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
