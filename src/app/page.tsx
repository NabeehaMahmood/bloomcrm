'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-bloom">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">BloomCRM</h1>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </main>
  );
}
