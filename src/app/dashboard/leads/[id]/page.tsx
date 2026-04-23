'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/shared/Sidebar';
import LeadDetail from '@/components/leads/LeadDetail';

export default function LeadPage() {
  const router = useRouter();
  const params = useParams();
  const [lead, setLead] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          router.push('/login');
          return;
        }

        setUser(JSON.parse(userData));

        const response = await axios.get(`/api/leads/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLead(response.data.lead);
        setActivities(response.data.activities);
      } catch (error: any) {
        console.error('Fetch lead error:', error);
        if (error.response?.status === 403) {
          router.push('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLead();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-500"></div>
          <p className="mt-4 text-gray-600">Loading lead...</p>
        </div>
      </div>
    );
  }

  if (!user || !lead) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">
        <LeadDetail lead={lead} activities={activities} user={user} />
      </main>
    </div>
  );
}
