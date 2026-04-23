'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/shared/Sidebar';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import AgentDashboard from '@/components/dashboard/AgentDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          router.push('/login');
          return;
        }

        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">
        {user.role === 'admin' ? (
          <AdminDashboard user={user} />
        ) : (
          <AgentDashboard user={user} />
        )}
      </main>
    </div>
  );
}
