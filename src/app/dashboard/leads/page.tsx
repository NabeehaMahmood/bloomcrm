'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/shared/Sidebar';
import LeadList from '@/components/leads/LeadList';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          router.push('/login');
          return;
        }

        setUser(JSON.parse(userData));

        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);

        const response = await axios.get(`/api/leads?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLeads(response.data.leads);
      } catch (error: any) {
        console.error('Fetch leads error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeads();
    }
  }, [user, filters, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-500"></div>
          <p className="mt-4 text-gray-600">Loading leads...</p>
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
        <LeadList
          leads={leads}
          user={user}
          filters={filters}
          setFilters={setFilters}
        />
      </main>
    </div>
  );
}
