'use client';
import { signOut } from 'next-auth/react';


export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome to My App</h1>

      <button
        onClick={() => signOut()}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign out
      </button>
    </main>
  );
}
