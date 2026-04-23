'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import CreateLeadModal from '@/components/leads/CreateLeadModal';

interface AgentDashboardProps {
  user: any;
}

export default function AgentDashboard({ user }: AgentDashboardProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    contacted: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('/api/leads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(response.data.leads);

        // Calculate stats
        const total = response.data.leads.length;
        const contacted = response.data.leads.filter(
          (l: any) => l.status !== 'new'
        ).length;
        const closed = response.data.leads.filter(
          (l: any) => l.status === 'closed_won' || l.status === 'closed_lost'
        ).length;

        setStats({ total, contacted, closed });
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLeads();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="section-heading">Agent Dashboard</h1>
          <p className="section-subheading">
            Hello {user.name}! Here are your assigned leads 🌿
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <span>➕</span>
          <span>New Lead</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Assigned</p>
                <p className="text-3xl font-bold text-bloom-600 mt-2">{stats.total}</p>
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Contacted</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.contacted}
                </p>
              </div>
              <span className="text-4xl">📞</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Closed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.closed}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Your Assigned Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bloom-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b hover:bg-bloom-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      PKR {lead.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          lead.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : lead.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {lead.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          lead.status === 'new'
                            ? 'bg-blue-100 text-blue-700'
                            : lead.status === 'closed_won'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/dashboard/leads/${lead._id}`}
                        className="text-bloom-600 hover:text-bloom-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">No leads assigned yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLeadCreated={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
        token={token!}
      />
    </div>
  );
}
